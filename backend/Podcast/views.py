from rest_framework import viewsets
from .models import Podcast
from .serializers import PodcastSerializer
from .permissions import IsAdminOrReadOnly
from people_first.visibility import PublicVisibilityMixin
from rest_framework.decorators import action
from rest_framework.response import Response

class PodcastViewSet(PublicVisibilityMixin, viewsets.ModelViewSet):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    permission_classes = [IsAdminOrReadOnly]

    @action(detail=False, methods=['get'])
    def latest(self, request):
        podcast = Podcast.objects.filter(is_active=True).order_by('-created_at').first()
        if not podcast:
            return Response({})
        return Response(self.get_serializer(podcast).data)