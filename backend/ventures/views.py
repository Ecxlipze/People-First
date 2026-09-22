from rest_framework import viewsets
from .models import Venture
from .serializers import VentureSerializer
from .permissions import IsAdminOrReadOnly

class VentureViewSet(viewsets.ModelViewSet):
    queryset = Venture.objects.all()
    serializer_class = VentureSerializer
    permission_classes = [IsAdminOrReadOnly]