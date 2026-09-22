import shutil
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings
from gallery.models import GalleryItem

GALLERY_SEED_DATA = [
  {
    "title": "Studio Interview",
    "alt_text": "Guest seated for a studio interview in the People First podcast space",
    "caption": "Podcast studio conversation.",
    "filename": "gallery1.webp",
  },
  {
    "title": "Partner Event",
    "alt_text": "Rai Salahuddin Ahmad at a People First partner event",
    "caption": "Partner networking and keynotes.",
    "filename": "gallery2.webp",
  },
  {
    "title": "Roundtable Discussion",
    "alt_text": "Panel discussion at a People First roundtable",
    "caption": "Panelists sharing perspectives at a roundtable.",
    "filename": "gallery3.webp",
  },
]

class Command(BaseCommand):
    help = "Seed the initial 3 mockup gallery photos into the database."

    def handle(self, *args, **options):
        base_dir = Path(settings.BASE_DIR)
        frontend_img_dir = base_dir.parent / "frontend" / "public" / "images" / "gallery"
        media_gallery_dir = Path(settings.MEDIA_ROOT) / "gallery"
        media_gallery_dir.mkdir(parents=True, exist_ok=True)

        self.stdout.write(f"Copying gallery photos from {frontend_img_dir} to {media_gallery_dir}...")

        seeded_count = 0
        for i, item in enumerate(GALLERY_SEED_DATA):
            filename = item["filename"]
            src_file = frontend_img_dir / filename
            dst_file = media_gallery_dir / filename

            if src_file.exists():
                shutil.copy2(src_file, dst_file)
                image_rel_path = f"gallery/{filename}"
                self.stdout.write(self.style.SUCCESS(f"  ✓ Copied {filename}"))
            else:
                self.stdout.write(self.style.ERROR(f"  ✗ Source file not found: {src_file}"))
                continue

            gallery_item, created = GalleryItem.objects.update_or_create(
                alt_text=item["alt_text"],
                defaults={
                    "title": item["title"],
                    "caption": item["caption"],
                    "image": image_rel_path,
                    "display_order": i,
                    "is_active": True,
                },
            )
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"  [{action}] {gallery_item.title} (order: {i})"))
            seeded_count += 1

        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully seeded {seeded_count} gallery photos!"))
