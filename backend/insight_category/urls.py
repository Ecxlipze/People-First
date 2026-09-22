from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InsightCategoryViewSet, InsightViewSet

router = DefaultRouter()
router.register('insight-categories', InsightCategoryViewSet, basename='insight-category')
router.register('insights', InsightViewSet, basename='insight')

urlpatterns = [
    path('', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)