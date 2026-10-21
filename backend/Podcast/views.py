import os
import threading
import time
from django.conf import settings
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

PODCAST_SYNC_INTERVAL_SECONDS = 3600  # 1 hour

def _async_sync():
    try:
        run_sync()
    except Exception:
        pass

def _should_sync() -> bool:
    sync_file = settings.BASE_DIR / 'tmp' / 'youtube_last_sync'
    now = time.time()
    try:
        if sync_file.exists():
            mtime = sync_file.stat().st_mtime
            if (now - mtime) < PODCAST_SYNC_INTERVAL_SECONDS:
                return False
    except OSError:
        pass
    try:
        sync_file.parent.mkdir(parents=True, exist_ok=True)
        sync_file.touch()
    except OSError:
        pass
    return True

class PodcastViewSet(PublicVisibilityMixin, viewsets.ModelViewSet):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    permission_classes = [IsAdminOrReadOnly]

    def list(self, request, *args, **kwargs):
        # Auto-sync in background thread: check if 1 hour has passed since last sync
        if _should_sync():
            threading.Thread(target=_async_sync, daemon=True).start()

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
