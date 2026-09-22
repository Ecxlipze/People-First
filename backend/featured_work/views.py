from rest_framework import viewsets
from .models import FeaturedWork
from .serializers import FeaturedWorkSerializer
from .permissions import IsAdminOrReadOnly

class FeaturedWorkViewSet(viewsets.ModelViewSet):
    queryset = FeaturedWork.objects.all()
    serializer_class = FeaturedWorkSerializer
    permission_classes = [IsAdminOrReadOnly]