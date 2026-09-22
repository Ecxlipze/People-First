import shutil
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings
from Podcast.models import Podcast

PODCAST_SEED_DATA = [
    {
        "title": "Podcast 1 : world will know about the magic of digital world & its achievements.",
        "slug": "podcast-1-magic-of-digital-world",
        "description": "Largest digital marketing conference",
        "badge": "Largest digital marketing conference",
        "badge_colour": "#2dbe9e",
        "metric_value": "50+ clients",
        "metric_label": "Search Digital Agency New York, Information from Trusted Internet. Explore the Best Info Now.",
        "supporting_title": "Concept",
        "supporting_content": "For more than 50 years, global stage for innovation. And the all-digital CES 2022 continued to be.",
        "thumbnail_file": "ep-itcn.webp",
        "video_url": "https://www.youtube.com/watch?v=QM_mLwuP8vs",
        "order": 0,
        "is_featured": True,
    },
    {
        "title": "Podcast 2 : world will know about the magic of digital world & its achievements.",
        "slug": "podcast-2-magic-of-digital-world",
        "description": "Largest digital marketing conference",
        "badge": "Largest digital marketing conference",
        "badge_colour": "#d92d5e",
        "metric_value": "50+ clients",
        "metric_label": "Search Digital Agency New York, Information from Trusted Internet. Explore the Best Info Now.",
        "supporting_title": "Concept",
        "supporting_content": "For more than 50 years, global stage for innovation. And the all-digital CES 2022 continued to be.",
        "thumbnail_file": "ep-press.webp",
        "video_url": "",
        "order": 1,
        "is_featured": True,
    },
    {
        "title": "Podcast 3: world will know about the magic of digital world & its achievements.",
        "slug": "podcast-3-magic-of-digital-world",
        "description": "Largest digital marketing conference",
        "badge": "Largest digital marketing conference",
        "badge_colour": "#3f2a6b",
        "metric_value": "50+ clients",
        "metric_label": "Search Digital Agency New York, Information from Trusted Internet. Explore the Best Info Now.",
        "supporting_title": "Concept",
        "supporting_content": "For more than 50 years, global stage for innovation. And the all-digital CES 2022 continued to be.",
        "thumbnail_file": "ep-5g.webp",
        "video_url": "",
        "order": 2,
        "is_featured": True,
    },
]

class Command(BaseCommand):
    help = "Seed the initial 3 mockup podcast episodes into the database with thumbnails."

    def handle(self, *args, **options):
        base_dir = Path(settings.BASE_DIR)
        frontend_img_dir = base_dir.parent / "frontend" / "public" / "images" / "podcast"
        media_thumb_dir = Path(settings.MEDIA_ROOT) / "podcasts" / "thumbnails"
        media_thumb_dir.mkdir(parents=True, exist_ok=True)

        self.stdout.write(f"Copying podcast thumbnails from {frontend_img_dir} to {media_thumb_dir}...")

        seeded_count = 0
        for item in PODCAST_SEED_DATA:
            thumb_filename = item["thumbnail_file"]
            src_file = frontend_img_dir / thumb_filename
            dst_file = media_thumb_dir / thumb_filename

            thumb_rel_path = None
            if src_file.exists():
                shutil.copy2(src_file, dst_file)
                thumb_rel_path = f"podcasts/thumbnails/{thumb_filename}"
                self.stdout.write(self.style.SUCCESS(f"  ✓ Copied {thumb_filename}"))
            else:
                self.stdout.write(self.style.WARNING(f"  ⚠ Thumbnail not found: {src_file}"))

            podcast, created = Podcast.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "title": item["title"],
                    "description": item["description"],
                    "badge": item["badge"],
                    "badge_colour": item["badge_colour"],
                    "metric_value": item["metric_value"],
                    "metric_label": item["metric_label"],
                    "supporting_title": item["supporting_title"],
                    "supporting_content": item["supporting_content"],
                    "thumbnail": thumb_rel_path,
                    "video_url": item["video_url"],
                    "order": item["order"],
                    "is_featured": item["is_featured"],
                    "is_active": True,
                },
            )
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"  [{action}] {podcast.title} (order: {podcast.order})"))
            seeded_count += 1

        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully seeded {seeded_count} podcasts!"))
