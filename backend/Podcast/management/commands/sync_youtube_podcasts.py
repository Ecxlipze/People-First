from django.core.management.base import BaseCommand, CommandError

from Podcast.sync import run_sync
from Podcast.youtube_sync import YouTubeSyncError


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
            result = run_sync(
                limit=opts["limit"], refresh=opts["refresh"], dry_run=opts["dry_run"],
                log=self.stdout.write,
            )
        except YouTubeSyncError as exc:
            raise CommandError(str(exc))
        verb = "would create" if opts["dry_run"] else "created"
        self.stdout.write(self.style.SUCCESS(
            f"{result['read']} videos read: {verb} {result['created']}, updated {result['updated']}."))
