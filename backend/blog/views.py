from django.utils import timezone
from rest_framework import viewsets

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
