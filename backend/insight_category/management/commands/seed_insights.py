import shutil
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings
from insight_category.models import InsightCategory, Insight

CATEGORY_SEED_DATA = [
    {
        "name": "Digital Commerce",
        "slug": "digital-commerce",
        "display_order": 1,
        "is_active": True,
    },
    {
        "name": "Business Growth",
        "slug": "business-growth",
        "display_order": 2,
        "is_active": True,
    },
    {
        "name": "Skills & Training",
        "slug": "skills-training",
        "display_order": 3,
        "is_active": True,
    },
]

INSIGHT_SEED_DATA = [
    {
        "title": "Reasons Pakistani Manufacturers Should Start Selling Online",
        "slug": "reasons-pakistani-manufacturers-should-start-selling-online",
        "category_slug": "digital-commerce",
        "summary": "The strategy is the key to grow your business through online marketing",
        "content": (
            "The strategy is the key to grow your business through online marketing. "
            "Practical guidance, operational insights, and execution strategies for "
            "Pakistani manufacturers expanding into digital and export channels."
        ),
        "metric": "80%",
        "metric_label": "Beneficial\nMarketing tips",
        "card_value": "2025",
        "card_label": "MARKETING\nTIPS",
        "thumbnail_file": "article-1.webp",
        "thumbnail_alt": "Audience at a People First industry session on selling online",
        "studio_thumbnail_file": "studio/studio-audience.webp",
        "studio_thumbnail_alt": "Audience attending a People First business and industry conference",
        "order": 0,
        "publish_status": Insight.PublishStatus.PUBLISHED,
    },
    {
        "title": "How to Digitize Your Business Without a Big Budget",
        "slug": "how-to-digitize-your-business-without-a-big-budget",
        "category_slug": "business-growth",
        "summary": (
            "We are strategy consultants who work with startup strategies and "
            "help promote and sell your products, including helping marketing."
        ),
        "content": (
            "We are strategy consultants who work with startup strategies and "
            "help promote and sell your products, including helping marketing. "
            "Lean digital adoption frameworks for emerging businesses."
        ),
        "metric": "80%",
        "metric_label": "Increased\nPerformance Rate",
        "card_value": "27%",
        "card_label": "Productivity increase\non average",
        "thumbnail_file": "article-2.webp",
        "thumbnail_alt": "Panel interview with the Punjab Information Technology Board",
        "studio_thumbnail_file": None,
        "studio_thumbnail_alt": None,
        "order": 1,
        "publish_status": Insight.PublishStatus.PUBLISHED,
    },
    {
        "title": "Building Market-Ready Skills That Employers Actually Hire For",
        "slug": "building-market-ready-skills-that-employers-actually-hire-for",
        "category_slug": "skills-training",
        "summary": (
            "Practical, income-generating training built around what the market "
            "needs right now — not what it needed five years ago."
        ),
        "content": (
            "Practical, income-generating training built around what the market "
            "needs right now — not what it needed five years ago. Connecting "
            "high-demand modern skills directly with employer hiring pipelines."
        ),
        "metric": "80%",
        "metric_label": "Beneficial\nMarketing tips",
        "card_value": "2025",
        "card_label": "MARKETING\nTIPS",
        "thumbnail_file": "article-3.webp",
        "thumbnail_alt": "Group photo at the Lahore Chamber of Commerce & Industry",
        "studio_thumbnail_file": None,
        "studio_thumbnail_alt": None,
        "order": 2,
        "publish_status": Insight.PublishStatus.PUBLISHED,
    },
]


class Command(BaseCommand):
    help = "Seed initial mockup insights and categories into the database with media files."

    def handle(self, *args, **options):
        base_dir = Path(settings.BASE_DIR)
        frontend_img_dir = base_dir.parent / "frontend" / "public" / "images" / "insights"
        media_insights_dir = Path(settings.MEDIA_ROOT) / "insights"
        media_studio_dir = media_insights_dir / "studio"

        media_insights_dir.mkdir(parents=True, exist_ok=True)
        media_studio_dir.mkdir(parents=True, exist_ok=True)

        self.stdout.write("Cleaning up dummy categories if present...")
        InsightCategory.objects.filter(slug="asfdh").delete()

        self.stdout.write("\nSeeding Insight Categories...")
        categories_map = {}
        for cat_data in CATEGORY_SEED_DATA:
            cat, created = InsightCategory.objects.update_or_create(
                slug=cat_data["slug"],
                defaults={
                    "name": cat_data["name"],
                    "display_order": cat_data["display_order"],
                    "is_active": cat_data["is_active"],
                },
            )
            categories_map[cat.slug] = cat
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"  [{action}] Category: {cat.name} (order: {cat.display_order})"))

        self.stdout.write(f"\nCopying insight images from {frontend_img_dir} to {media_insights_dir}...")

        seeded_count = 0
        for item in INSIGHT_SEED_DATA:
            # 1. Main Thumbnail
            thumb_rel_path = None
            if item.get("thumbnail_file"):
                src_file = frontend_img_dir / item["thumbnail_file"]
                dst_file = media_insights_dir / item["thumbnail_file"]
                if src_file.exists():
                    shutil.copy2(src_file, dst_file)
                    thumb_rel_path = f"insights/{item['thumbnail_file']}"
                    self.stdout.write(self.style.SUCCESS(f"  ✓ Copied thumbnail: {item['thumbnail_file']}"))
                else:
                    self.stdout.write(self.style.WARNING(f"  ⚠ Thumbnail not found: {src_file}"))

            # 2. Studio Thumbnail
            studio_thumb_rel_path = None
            if item.get("studio_thumbnail_file"):
                raw_studio_file = Path(item["studio_thumbnail_file"]).name
                src_studio = frontend_img_dir / raw_studio_file
                dst_studio = media_studio_dir / raw_studio_file
                if src_studio.exists():
                    shutil.copy2(src_studio, dst_studio)
                    studio_thumb_rel_path = f"insights/studio/{raw_studio_file}"
                    self.stdout.write(self.style.SUCCESS(f"  ✓ Copied studio thumbnail: {raw_studio_file}"))
                else:
                    self.stdout.write(self.style.WARNING(f"  ⚠ Studio thumbnail not found: {src_studio}"))

            category = categories_map.get(item["category_slug"])

            insight, created = Insight.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "category": category,
                    "title": item["title"],
                    "summary": item["summary"],
                    "content": item["content"],
                    "metric": item["metric"],
                    "metric_label": item["metric_label"],
                    "card_value": item["card_value"],
                    "card_label": item["card_label"],
                    "thumbnail": thumb_rel_path,
                    "thumbnail_alt": item["thumbnail_alt"],
                    "studio_thumbnail": studio_thumb_rel_path,
                    "studio_thumbnail_alt": item["studio_thumbnail_alt"],
                    "order": item["order"],
                    "publish_status": item["publish_status"],
                },
            )
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"  [{action}] Insight: {insight.title} (order: {insight.order})"))
            seeded_count += 1

        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully seeded {seeded_count} insights across {len(categories_map)} categories!"))
