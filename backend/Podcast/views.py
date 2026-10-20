from rest_framework import viewsets
from .models import Podcast
from .serializers import PodcastSerializer
from .permissions import IsAdminOrReadOnly
from people_first.visibility import PublicVisibilityMixin
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from .sync import run_sync
from .youtube import fetch_youtube_metadata
from .youtube_sync import YouTubeSyncError

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

    # The two actions below back the CMS (/cms/podcasts); both are staff-only.
    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def sync(self, request):
        """Pull new videos from the configured YouTube channel/playlist now."""
        try:
            return Response(run_sync())
        except YouTubeSyncError as exc:
            return Response({'detail': str(exc)}, status=502)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def lookup(self, request):
        """Title, description, duration and date for a YouTube URL (no key needed)."""
        data = fetch_youtube_metadata(request.query_params.get('url', ''))
        return Response(data, status=200 if data.get('success') else 400)
