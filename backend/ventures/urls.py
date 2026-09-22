from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VentureViewSet

router = DefaultRouter()
router.register('ventures', VentureViewSet, basename='venture')

urlpatterns = [
    path('', include(router.urls)),
]