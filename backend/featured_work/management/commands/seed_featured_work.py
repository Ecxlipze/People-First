import shutil
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings
from featured_work.models import FeaturedWork

FEATURED_BLOCKS = [
    {
        "order": 0,
        "title": "Podcast: market\nstrategy",
        "description": "We are strategy consultants who work with startup strategies and help promote and sell your products, including helping marketing.",
        "metric_value": "80%",
        "metric_label": "Increased\nPerformance Rate",
        "secondary_metric_value": "27%",
        "secondary_metric_label": "have knowledge about market strategies.",
        "bullets": [],
        "thumbnail_file": "feature1.webp",
        "video_url": "https://www.youtube.com/watch?v=QM_mLwuP8vs",
    },
    {
        "order": 1,
        "title": "Tech Events\nManagement.",
        "description": "We are strategy consultants who work with startup strategies and help promote and sell your products, including helping marketing.",
        "metric_value": "30%",
        "metric_label": "management skills",
        "secondary_metric_value": "45%",
        "secondary_metric_label": "Productivity events all over Pakistan",
        "bullets": [
            "Seminars",
            "Round Talks",
            "Table Talks",
            "Conferences",
            "Tech Talks",
        ],
        "thumbnail_file": "feature2.webp",
        "video_url": "",
    },
]

class Command(BaseCommand):
    help = "Seed the 2 Featured Work blocks (Podcast and Tech Events) into the database."

    def handle(self, *args, **options):
        base_dir = Path(settings.BASE_DIR)
        frontend_img_dir = base_dir.parent / "frontend" / "public" / "images" / "featured"
        media_thumb_dir = Path(settings.MEDIA_ROOT) / "featured-work" / "thumbnails"
        media_thumb_dir.mkdir(parents=True, exist_ok=True)

        self.stdout.write(f"Copying featured work images from {frontend_img_dir} to {media_thumb_dir}...")

        FeaturedWork.objects.all().delete()

        seeded_count = 0
        for block in FEATURED_BLOCKS:
            thumb_filename = block["thumbnail_file"]
            src_file = frontend_img_dir / thumb_filename
            dst_file = media_thumb_dir / thumb_filename

            thumb_rel_path = None
            if src_file.exists():
                shutil.copy2(src_file, dst_file)
                thumb_rel_path = f"featured-work/thumbnails/{thumb_filename}"
                self.stdout.write(self.style.SUCCESS(f"  ✓ Copied {thumb_filename}"))
            else:
                self.stdout.write(self.style.WARNING(f"  ⚠ Image not found: {src_file}"))

            obj = FeaturedWork.objects.create(
                order=block["order"],
                title=block["title"],
                description=block["description"],
                metric_value=block["metric_value"],
                metric_label=block["metric_label"],
                secondary_metric_value=block["secondary_metric_value"],
                secondary_metric_label=block["secondary_metric_label"],
                bullets=block["bullets"],
                thumbnail=thumb_rel_path,
                video_url=block["video_url"],
            )
            action = "Created"
            self.stdout.write(self.style.SUCCESS(f"  [{action}] Block {block['order']}: {obj.title.replace(chr(10), ' ')}"))
            seeded_count += 1

        # Delete any extra records with order > 1
        extra = FeaturedWork.objects.filter(order__gt=1)
        if extra.exists():
            extra.delete()

        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully seeded {seeded_count} Featured Work blocks!"))
