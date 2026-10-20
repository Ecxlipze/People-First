import time
from rest_framework import viewsets
from django.core.cache import cache
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

PODCAST_SYNC_CACHE_KEY = "podcast_youtube_last_sync_time"
PODCAST_SYNC_INTERVAL_SECONDS = 3600  # 1 hour

class PodcastViewSet(PublicVisibilityMixin, viewsets.ModelViewSet):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    permission_classes = [IsAdminOrReadOnly]

    def list(self, request, *args, **kwargs):
        # Auto-sync in code: check if 1 hour has passed since last sync
        last_sync = cache.get(PODCAST_SYNC_CACHE_KEY)
        now = time.time()
        if not last_sync or (now - last_sync) > PODCAST_SYNC_INTERVAL_SECONDS:
            # Set cache immediately to prevent concurrent requests from double-syncing
            cache.set(PODCAST_SYNC_CACHE_KEY, now, timeout=PODCAST_SYNC_INTERVAL_SECONDS * 2)
            try:
                run_sync()
            except Exception:
                pass  # Graceful fallback: do not fail public listing if YouTube is unreachable

        return super().list(request, *args, **kwargs)

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
