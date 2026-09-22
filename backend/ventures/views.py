from rest_framework import viewsets
from .models import Venture
from .serializers import VentureSerializer
from .permissions import IsAdminOrReadOnly
from people_first.visibility import PublicVisibilityMixin

class VentureViewSet(PublicVisibilityMixin, viewsets.ModelViewSet):
    queryset = Venture.objects.all()
    serializer_class = VentureSerializer
    permission_classes = [IsAdminOrReadOnly]