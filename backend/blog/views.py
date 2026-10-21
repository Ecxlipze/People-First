import uuid

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from django.core.files.storage import default_storage
from django.db.models import F, Q
from django.utils import timezone
from PIL import Image
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from people_first.visibility import PublicVisibilityMixin, is_staff_request

from .models import BlogCategory, BlogPost
from .permissions import (
    IsAdminOrReadOnly, IsStaffOrBlogAuthor, IsStaffOrBlogAuthorOrReadOnly, is_blog_author,
)
from .serializers import BlogCategorySerializer, BlogPostListSerializer, BlogPostSerializer


class BlogCategoryViewSet(PublicVisibilityMixin, viewsets.ModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [IsAdminOrReadOnly]


def display_name(user):
    return user.get_full_name().strip() or user.get_username()


class BlogPostViewSet(viewsets.ModelViewSet):
    """Staff manage every post. A Blog Authors user (non-staff) may read the
    live posts, create drafts, and edit only their own drafts; they cannot
    publish, delete, reorder or change the author line, which is always their
    own name."""
    queryset = BlogPost.objects.select_related("category")
    permission_classes = [IsStaffOrBlogAuthorOrReadOnly]
    lookup_field = "slug"

    def get_serializer_class(self):
        return BlogPostListSerializer if self.action == "list" else BlogPostSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        live = Q(status=BlogPost.Status.PUBLISHED, published_at__lte=timezone.now())
        if is_staff_request(self.request):
            pass
        elif self.action != "view" and is_blog_author(self.request.user):
            # The live posts plus their own work in progress, never anyone else's.
            queryset = queryset.filter(live | Q(author=self.request.user))
        else:
            # Drafts and not-yet-due scheduled posts never leave the API.
            queryset = queryset.filter(live)
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category__slug=category)
        return queryset

    def _restricted(self):
        return self.action in ("create", "update", "partial_update", "destroy") and not is_staff_request(self.request)

    def get_object(self):
        post = super().get_object()
        if self._restricted():
            if self.action == "destroy":
                raise PermissionDenied("Authors cannot delete posts.")
            if post.author_id != self.request.user.id or post.status != BlogPost.Status.DRAFT:
                raise PermissionDenied("You can only edit your own drafts.")
        return post

    def perform_create(self, serializer):
        if not self._restricted():
            return super().perform_create(serializer)
        user = self.request.user
        serializer.save(
            author=user, author_name=display_name(user),
            status=BlogPost.Status.DRAFT, published_at=None, order=0,
        )

    def perform_update(self, serializer):
        if not self._restricted():
            return super().perform_update(serializer)
        serializer.save(
            author_name=display_name(self.request.user),
            status=BlogPost.Status.DRAFT, published_at=None, order=serializer.instance.order,
        )

    @action(detail=True, methods=["post"], permission_classes=[AllowAny])
    def view(self, request, slug=None):
        """Count one read of a published post.

        get_queryset() already hides drafts and scheduled posts from non-staff,
        so an unpublished slug is a 404 and cannot be counted. The increment is
        a single UPDATE (atomic under concurrent readers) and, being a queryset
        update, leaves updated_at alone.
        """
        post = self.get_object()
        BlogPost.objects.filter(pk=post.pk).update(view_count=F("view_count") + 1)
        post.refresh_from_db(fields=["view_count"])
        return Response({"view_count": post.view_count})


class BlogSessionView(APIView):
    """Lets the CMS confirm a freshly issued token may use it, and which role."""
    permission_classes = [IsStaffOrBlogAuthor]

    def get(self, request):
        return Response({
            "username": request.user.get_username(),
            "display_name": display_name(request.user),
            "role": "staff" if request.user.is_staff else "author",
        })


def profile_payload(user):
    return {
        "username": user.get_username(),
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "display_name": display_name(user),
        "role": "staff" if user.is_staff else "author",
    }


class ProfileView(APIView):
    """The signed-in CMS user's own profile. The username is read-only."""
    permission_classes = [IsStaffOrBlogAuthor]

    def get(self, request):
        return Response(profile_payload(request.user))

    def patch(self, request):
        user = request.user
        errors = {}
        values = {}
        for field, limit in (("first_name", 150), ("last_name", 150), ("email", 254)):
            if field in request.data:
                value = str(request.data[field] or "").strip()
                if len(value) > limit:
                    errors[field] = [f"Keep this to {limit} characters."]
                values[field] = value
        if values.get("email"):
            try:
                EmailValidator()(values["email"])
            except ValidationError:
                errors["email"] = ["Enter a valid email address."]
        if errors:
            return Response(errors, status=400)
        for field, value in values.items():
            setattr(user, field, value)
        user.save(update_fields=list(values) or None)
        return Response(profile_payload(user))


class PasswordChangeView(APIView):
    permission_classes = [IsStaffOrBlogAuthor]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "password"

    def post(self, request):
        user = request.user
        current = str(request.data.get("current_password") or "")
        new = str(request.data.get("new_password") or "")
        if not user.check_password(current):
            return Response({"current_password": ["That is not your current password."]}, status=400)
        try:
            validate_password(new, user)
        except ValidationError as exc:
            return Response({"new_password": list(exc.messages)}, status=400)
        user.set_password(new)
        user.save(update_fields=["password"])
        return Response({"detail": "Password changed."})


MAX_UPLOAD_BYTES = 5 * 1024 * 1024
ALLOWED_IMAGE_FORMATS = {"JPEG": "jpg", "PNG": "png", "GIF": "gif", "WEBP": "webp"}


class BlogImageUploadView(APIView):
    """Staff and blog-author image upload for pictures placed inside a post body."""
    permission_classes = [IsStaffOrBlogAuthor]
    parser_classes = [MultiPartParser]

    def post(self, request):
        upload = request.FILES.get("file")
        if upload is None:
            return Response({"detail": "No file was sent."}, status=400)
        if upload.size > MAX_UPLOAD_BYTES:
            return Response({"detail": "Images must be 5 MB or smaller."}, status=400)
        try:
            image = Image.open(upload)
            ext = ALLOWED_IMAGE_FORMATS[image.format]
            image.verify()
        except Exception:
            return Response({"detail": "Upload a JPEG, PNG, GIF or WebP image."}, status=400)
        upload.seek(0)
        name = default_storage.save(f"blog/inline/{uuid.uuid4().hex}.{ext}", upload)
        return Response({"url": request.build_absolute_uri(default_storage.url(name))}, status=201)
