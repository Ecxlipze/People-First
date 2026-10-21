from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BlogCategoryViewSet, BlogImageUploadView, BlogPostViewSet, BlogSessionView, PasswordChangeView, ProfileView

router = DefaultRouter()
router.register("blog-categories", BlogCategoryViewSet, basename="blog-category")
router.register("blog-posts", BlogPostViewSet, basename="blog-post")

urlpatterns = [
    path("blog-session/", BlogSessionView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("profile/password/", PasswordChangeView.as_view()),
    path("blog-uploads/", BlogImageUploadView.as_view()),
    path("", include(router.urls)),
]
