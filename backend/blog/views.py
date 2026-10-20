import uuid

from django.core.files.storage import default_storage
from django.utils import timezone
from PIL import Image
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from people_first.visibility import PublicVisibilityMixin, is_staff_request

from .models import BlogCategory, BlogPost
from .permissions import IsAdminOrReadOnly
from .serializers import BlogCategorySerializer, BlogPostListSerializer, BlogPostSerializer


class BlogCategoryViewSet(PublicVisibilityMixin, viewsets.ModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.select_related("category")
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"

    def get_serializer_class(self):
        return BlogPostListSerializer if self.action == "list" else BlogPostSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if not is_staff_request(self.request):
            # Drafts and not-yet-due scheduled posts never leave the API.
            queryset = queryset.filter(
                status=BlogPost.Status.PUBLISHED, published_at__lte=timezone.now(),
            )
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category__slug=category)
        return queryset


class BlogSessionView(APIView):
    """Lets the CMS confirm a freshly issued token belongs to a staff user."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({"username": request.user.get_username()})


MAX_UPLOAD_BYTES = 5 * 1024 * 1024
ALLOWED_IMAGE_FORMATS = {"JPEG": "jpg", "PNG": "png", "GIF": "gif", "WEBP": "webp"}


class BlogImageUploadView(APIView):
    """Staff-only image upload for pictures placed inside a post body."""
    permission_classes = [IsAdminUser]
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
