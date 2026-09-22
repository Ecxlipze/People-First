import os
import shutil
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings
from testimonial.models import Testimonial

SEED_DATA = [
    {
        "name": "Darrell Steward",
        "handle": "@darrels",
        "body": "You made it so simple. My new site is so much faster and easier to work with than my old site. I just choose the page, make the change and click save.",
        "tags": ["another"],
        "avatar_file": "darrell-steward.webp",
    },
    {
        "name": "Guy Hawkins",
        "handle": "@jennywilson",
        "body": "This is a top quality product. No need to think twice before making it live on web.",
        "tags": ["make_it_fast"],
        "avatar_file": "guy-hawkins.webp",
    },
    {
        "name": "Leslie Alexander",
        "handle": "@lesslie",
        "body": "Simply the best. Better than all the rest. I’d recommend this product to beginners and advanced users.",
        "tags": ["postcrafts"],
        "avatar_file": "leslie-alexander.webp",
    },
    {
        "name": "Marvin McKinney",
        "handle": "@jennywilson",
        "body": "With Postcrafts, it’s quicker with the customer, the customer is more ensured of getting exactly what they ordered, and I’m all for the efficiency.",
        "tags": ["dev", "tools"],
        "avatar_file": "marvin-mckinney.webp",
    },
    {
        "name": "Jenny Wilson",
        "handle": "@jennywilson",
        "body": "This is a top quality product. No need to think twice before making it live on web.",
        "tags": ["make_it_fast"],
        "avatar_file": "jenny-wilson.webp",
    },
    {
        "name": "Annette Black",
        "handle": "@jennywilson",
        "body": "You made it so simple. My new site is so much faster and easier to work with than my old site. I just choose the page, make the change and click save.",
        "tags": ["another"],
        "avatar_file": "annette-black.webp",
    },
    {
        "name": "Kristin Watson",
        "handle": "@kristinwatson2",
        "body": "Finally, I’ve found a template that covers all bases for a bootstrapped startup. We were able to launch in days, not months.",
        "tags": ["postcrafts"],
        "avatar_file": "kristin-watson.webp",
    },
    {
        "name": "Floyd Miles",
        "handle": "@jennywilson",
        "body": "My new site is so much faster and easier to work with than my old site. I just choose the page, make the change and click save.",
        "tags": ["postcrafts"],
        "avatar_file": "floyd-miles.webp",
    },
]

class Command(BaseCommand):
    help = "Seed the initial 8 mockup testimonials into the database with avatars."

    def handle(self, *args, **options):
        # Determine source path for images in frontend
        base_dir = Path(settings.BASE_DIR)
        frontend_img_dir = base_dir.parent / "frontend" / "public" / "images" / "home" / "testimonials"
        media_testimonials_dir = Path(settings.MEDIA_ROOT) / "testimonials"
        media_testimonials_dir.mkdir(parents=True, exist_ok=True)

        self.stdout.write(f"Copying avatars from {frontend_img_dir} to {media_testimonials_dir}...")

        seeded_count = 0
        for i, item in enumerate(SEED_DATA):
            avatar_filename = item["avatar_file"]
            src_file = frontend_img_dir / avatar_filename
            dst_file = media_testimonials_dir / avatar_filename

            avatar_rel_path = None
            if src_file.exists():
                shutil.copy2(src_file, dst_file)
                avatar_rel_path = f"testimonials/{avatar_filename}"
                self.stdout.write(self.style.SUCCESS(f"  ✓ Copied {avatar_filename}"))
            else:
                self.stdout.write(self.style.WARNING(f"  ⚠ File {src_file} not found, avatar will be null"))

            testimonial, created = Testimonial.objects.update_or_create(
                name=item["name"],
                defaults={
                    "handle": item["handle"],
                    "body": item["body"],
                    "tags": item["tags"],
                    "avatar": avatar_rel_path,
                    "display_order": i,
                    "is_active": True,
                },
            )
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"  [{action}] {testimonial.name} (order: {i})"))
            seeded_count += 1

        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully seeded {seeded_count} testimonials!"))
