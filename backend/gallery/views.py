from rest_framework import viewsets
from .models import GalleryItem
from .serializers import GalleryItemSerializer
from .permissions import IsAdminOrReadOnly

class GalleryItemViewSet(viewsets.ModelViewSet):
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemSerializer
    permission_classes = [IsAdminOrReadOnly]