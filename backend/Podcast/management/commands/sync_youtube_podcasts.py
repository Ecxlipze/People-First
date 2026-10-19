from django.conf import settings
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify

from Podcast.models import Podcast
from Podcast.youtube import download_youtube_thumbnail, extract_youtube_id
from Podcast.youtube_sync import YouTubeSyncError, fetch_videos


class Command(BaseCommand):
    help = (
        "Create a Podcast episode for every new video on the configured YouTube "
        "channel/playlist. Safe to run repeatedly (cron). Existing episodes keep "
        "their edited copy unless --refresh is passed."
    )

    def add_arguments(self, parser):
        parser.add_argument("--limit", type=int, help="Only look at the newest N videos.")
        parser.add_argument("--refresh", action="store_true",
                            help="Also overwrite title/description/date of episodes already synced.")
        parser.add_argument("--dry-run", action="store_true", help="Report what would change; write nothing.")

    def handle(self, *args, **opts):
        try:
            videos = fetch_videos(
                api_key=settings.YOUTUBE_API_KEY,
                channel_id=settings.YOUTUBE_CHANNEL_ID,
                handle=settings.YOUTUBE_CHANNEL_HANDLE,
                playlist_id=settings.YOUTUBE_PLAYLIST_ID,
                limit=opts["limit"],
            )
        except YouTubeSyncError as exc:
            raise CommandError(str(exc))

        # Episodes added by hand carry only a URL; adopt them by video id so
        # the sync does not create a second copy.
        by_id = {p.youtube_video_id: p for p in Podcast.objects.exclude(youtube_video_id=None)}
        for p in Podcast.objects.filter(youtube_video_id=None).exclude(video_url=None).exclude(video_url=""):
            vid = extract_youtube_id(p.video_url)
            if vid and vid not in by_id:
                by_id[vid] = p

        created = updated = 0
        for v in videos:
            vid = v["video_id"]
            existing = by_id.get(vid)
            if opts["dry_run"]:
                self.stdout.write(f"{'update' if existing else 'new   '} {vid} {v['title']}")
                created += not existing
                continue
            if existing:
                changed = []
                if existing.youtube_video_id != vid:
                    existing.youtube_video_id = vid
                    changed.append("youtube_video_id")
                if existing.published_at is None or opts["refresh"]:
                    existing.published_at = v["published_at"]
                    changed.append("published_at")
                if opts["refresh"]:
                    existing.title, existing.description = v["title"], v["description"] or v["title"]
                    changed += ["title", "description"]
                if changed:
                    existing.save(update_fields=changed + ["updated_at"])
                    updated += 1
                continue

            ep = Podcast(
                title=v["title"][:255],
                slug=self._unique_slug(v["title"], vid),
                description=v["description"] or v["title"],
                video_url=f"https://www.youtube.com/watch?v={vid}",
                youtube_video_id=vid,
                published_at=v["published_at"],
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

        verb = "would create" if opts["dry_run"] else "created"
        self.stdout.write(self.style.SUCCESS(
            f"{len(videos)} videos read: {verb} {created}, updated {updated}."))

    @staticmethod
    def _unique_slug(title: str, vid: str) -> str:
        base = slugify(title)[:50] or vid.lower()
        slug = base
        if Podcast.objects.filter(slug=slug).exists():
            slug = f"{base}-{vid.lower()}"
        return slug
