from rest_framework import viewsets
from .models import FeaturedWork
from .serializers import FeaturedWorkSerializer
from .permissions import IsAdminOrReadOnly


class FeaturedWorkViewSet(viewsets.ModelViewSet):
    queryset = FeaturedWork.objects.all()
    serializer_class = FeaturedWorkSerializer
    # Was omitted, which fell through to DRF's default of AllowAny and left
    # create/update/delete open to unauthenticated callers. Every sibling
    # content viewset is read-public, write-admin; this one is no different.
    # FeaturedWork has no is_active flag, so there is nothing to scope.
    permission_classes = [IsAdminOrReadOnly]
