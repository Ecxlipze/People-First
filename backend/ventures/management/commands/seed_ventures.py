import shutil
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings
from ventures.models import Venture

VENTURES_SEED_DATA = [
    {
        "name": "Merchanity",
        "subtitle": "Digital Commerce Solutions",
        "logo_file": "merchanity.webp",
        "website_url": "https://merchanity.com",
        "accent": "#2c8e85",
        "border_gradient": "radial-gradient(52.47% 174.19% at 50% 50%, #39CABD 0%, #246D67 100%)",
    },
    {
        "name": "Insights",
        "subtitle": "Media & IT Intelligence",
        "logo_file": "insights.webp",
        "website_url": "https://insights.peoplefirst.com",
        "accent": "#a00017",
        "border_gradient": "radial-gradient(118% 127% at 50% 50%, #FFFFFF 0%, #A00017 100%)",
    },
    {
        "name": "SME & Consumer",
        "subtitle": "Media & IT Intelligence",
        "logo_file": None,
        "website_url": None,
        "accent": "#a00017",
        "border_gradient": "radial-gradient(118% 127% at 50% 50%, #FFFFFF 0%, #A00017 100%)",
    },
    {
        "name": "Health care",
        "subtitle": "Media & IT Intelligence",
        "logo_file": None,
        "website_url": None,
        "accent": "#a00017",
        "border_gradient": "radial-gradient(118% 127% at 50% 50%, #FFFFFF 0%, #A00017 100%)",
    },
    {
        "name": "Technology",
        "subtitle": "Media & IT Intelligence",
        "logo_file": None,
        "website_url": None,
        "accent": "#a00017",
        "border_gradient": "radial-gradient(118% 127% at 50% 50%, #FFFFFF 0%, #A00017 100%)",
    },
    {
        "name": "Abaad.pk",
        "subtitle": "Smart Property Solutions",
        "logo_file": "abaad.webp",
        "website_url": "https://abaad.pk",
        "accent": "#2e21b6",
        "border_gradient": "radial-gradient(109% 107% at 50% 50%, #FFFFFF 0%, #2E21B6 100%)",
    },
    {
        "name": "Kissan Veer",
        "subtitle": "Empowering Agriculture",
        "logo_file": "kissan-veer.webp",
        "website_url": "https://kissanveer.com",
        "accent": "#2c8e85",
        "border_gradient": "radial-gradient(52.47% 174.19% at 50% 50%, #39CABD 0%, #246D67 100%)",
    },
    {
        "name": "Renewable Energy",
        "subtitle": "Media & IT Intelligence",
        "logo_file": None,
        "website_url": None,
        "accent": "#a00017",
        "border_gradient": "radial-gradient(118% 127% at 50% 50%, #FFFFFF 0%, #A00017 100%)",
    },
    {
        "name": "Knowledge",
        "subtitle": "Media & IT Intelligence",
        "logo_file": None,
        "website_url": None,
        "accent": "#a00017",
        "border_gradient": "radial-gradient(59.2% 63.52% at 50% 50%, #FFFFFF 0%, #A00017 100%)",
    },
]

class Command(BaseCommand):
    help = "Seed the initial 9 mockup ventures into the database with logos."

    def handle(self, *args, **options):
        base_dir = Path(settings.BASE_DIR)
        frontend_img_dir = base_dir.parent / "frontend" / "public" / "images" / "home" / "ventures"
        media_ventures_dir = Path(settings.MEDIA_ROOT) / "ventures"
        media_ventures_dir.mkdir(parents=True, exist_ok=True)

        self.stdout.write(f"Copying venture logos from {frontend_img_dir} to {media_ventures_dir}...")

        seeded_count = 0
        for i, item in enumerate(VENTURES_SEED_DATA):
            logo_filename = item["logo_file"]
            logo_rel_path = None

            if logo_filename:
                src_file = frontend_img_dir / logo_filename
                dst_file = media_ventures_dir / logo_filename

                if src_file.exists():
                    shutil.copy2(src_file, dst_file)
                    logo_rel_path = f"ventures/{logo_filename}"
                    self.stdout.write(self.style.SUCCESS(f"  ✓ Copied {logo_filename}"))
                else:
                    self.stdout.write(self.style.WARNING(f"  ⚠ Logo not found: {src_file}"))

            venture, created = Venture.objects.update_or_create(
                name=item["name"],
                defaults={
                    "subtitle": item["subtitle"],
                    "website_url": item["website_url"],
                    "logo": logo_rel_path,
                    "accent": item["accent"],
                    "border_gradient": item["border_gradient"],
                    "display_order": i,
                    "is_active": True,
                },
            )
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"  [{action}] {venture.name} (order: {i})"))
            seeded_count += 1

        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully seeded {seeded_count} ventures!"))
