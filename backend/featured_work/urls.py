from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FeaturedWorkViewSet

router = DefaultRouter()
router.register('featured-work', FeaturedWorkViewSet, basename='featured-work')

urlpatterns = [
    path('', include(router.urls)),
]