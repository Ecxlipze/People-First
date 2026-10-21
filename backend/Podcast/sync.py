"""Creates Podcast rows from the configured YouTube channel/playlist.

Shared by `manage.py sync_youtube_podcasts` (cron) and the CMS "Sync now" button.
"""
from django.conf import settings
from django.core.files.base import ContentFile
from django.utils.text import slugify

from .models import Podcast
from .youtube import download_youtube_thumbnail, extract_youtube_id
from .youtube_sync import fetch_videos


def _unique_slug(title: str, vid: str) -> str:
    base = slugify(title)[:50] or vid.lower()
    return f"{base}-{vid.lower()}" if Podcast.objects.filter(slug=base).exists() else base


def run_sync(*, limit=None, refresh=False, dry_run=False, log=lambda line: None) -> dict:
    """Raises YouTubeSyncError if YouTube can't be read. Returns counts."""
    videos = fetch_videos(
        api_key=settings.YOUTUBE_API_KEY,
        channel_id=settings.YOUTUBE_CHANNEL_ID,
        handle=settings.YOUTUBE_CHANNEL_HANDLE,
        playlist_id=settings.YOUTUBE_PLAYLIST_ID,
        limit=limit,
    )

    # Episodes added by hand carry only a URL; adopt them by video id so the
    # sync does not create a second copy.
    by_id = {p.youtube_video_id: p for p in Podcast.objects.exclude(youtube_video_id=None)}
    for p in Podcast.objects.filter(youtube_video_id=None).exclude(video_url=None).exclude(video_url=""):
        vid = extract_youtube_id(p.video_url)
        if vid and vid not in by_id:
            by_id[vid] = p

    created = updated = 0
    for v in videos:
        vid = v["video_id"]
        existing = by_id.get(vid)
        if dry_run:
            log(f"{'update' if existing else 'new   '} {vid} {v['title']}")
            created += not existing
            continue
        if existing:
            changed = []
            if existing.youtube_video_id != vid:
                existing.youtube_video_id = vid
                changed.append("youtube_video_id")
            if existing.published_at is None or refresh:
                existing.published_at = v["published_at"]
                changed.append("published_at")
            views = v.get("views")
            if views is not None and existing.view_count != views:
                existing.view_count = views
                changed.append("view_count")
            if refresh:
                existing.title, existing.description = v["title"], v["description"] or v["title"]
                changed += ["title", "description"]
            if changed:
                existing.save(update_fields=changed + ["updated_at"])
                updated += 1
            continue

        ep = Podcast(
            title=v["title"][:255],
            slug=_unique_slug(v["title"], vid),
            description=v["description"] or v["title"],
            video_url=f"https://www.youtube.com/watch?v={vid}",
            youtube_video_id=vid,
            published_at=v["published_at"],
            view_count=v.get("views") or 0,
            supporting_title=v["published_at"].strftime("%b %Y"),
            supporting_content=f"Published by {v['author']}" if v["author"] else "Published",
        )
        if v["duration"]:
            ep.metric_value, ep.metric_label = v["duration"], "Episode Duration"
        img = download_youtube_thumbnail(v["thumbnail_url"])
        if img:
            ep.thumbnail.save(f"{ep.slug}-thumb.jpg", ContentFile(img), save=False)
        ep.save()
        created += 1

    return {"read": len(videos), "created": created, "updated": updated}
