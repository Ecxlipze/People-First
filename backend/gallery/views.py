from rest_framework import viewsets
from .models import GalleryItem
from .serializers import GalleryItemSerializer
from .permissions import IsAdminOrReadOnly
from people_first.visibility import PublicVisibilityMixin

class GalleryItemViewSet(PublicVisibilityMixin, viewsets.ModelViewSet):
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemSerializer
    permission_classes = [IsAdminOrReadOnly]