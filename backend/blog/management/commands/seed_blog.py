"""Fill the local database with sample blog categories and posts.

    python manage.py seed_blog            # 100 posts, adds categories
    python manage.py seed_blog --count 40
    python manage.py seed_blog --clear    # remove what this command created

Idempotent: seeded posts have slugs starting "seed-" and are matched on slug, so
re-running updates them rather than duplicating. Posts you wrote yourself are
never touched. Images reuse files already under MEDIA_ROOT; nothing is uploaded.
"""
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from django.utils.text import slugify

from blog.models import BlogCategory, BlogPost

SEED_PREFIX = "seed-"

# (name, topics). The first three categories already exist in a fresh install.
CATEGORIES = [
    ("Digital Commerce", ["Selling on Marketplaces", "Cash-on-Delivery Logistics", "Payment Gateways", "Social Commerce", "Cross-Border Exports", "Product Photography", "Online Storefronts", "Customer Returns", "Conversion Rates"]),
    ("Business Growth", ["Cash-Flow Planning", "Scaling a Sales Team", "Pricing Strategy", "Customer Retention", "Business Partnerships", "Market Expansion", "Operational Efficiency", "Brand Building", "Hiring Your First Ten"]),
    ("Skills & Training", ["Freelancing Skills", "Digital Marketing Courses", "Workplace Communication", "Data Literacy", "Technical Certifications", "Mentorship Programs", "Career Switching", "Public Speaking", "Learning in Public"]),
    ("Startups", ["Pre-Seed Fundraising", "Finding Product-Market Fit", "Founder Mental Health", "Pitch Decks", "Co-Founder Agreements", "Early Hires", "Lean Prototyping", "Startup Ecosystems", "Demo Days"]),
    ("Technology", ["Cloud Migration", "Cybersecurity Basics", "Low-Code Tools", "Open Source in Business", "Mobile-First Design", "APIs for Small Teams", "Automation Workflows", "Data Backups", "Choosing a Tech Stack"]),
    ("Artificial Intelligence", ["AI Assistants at Work", "Prompt Writing", "AI in Customer Support", "Responsible AI Use", "Forecasting with Machine Learning", "AI and Jobs", "Document Automation", "Computer Vision for Retail", "Local-Language Models"]),
    ("Fintech", ["Digital Wallets", "Raast and Instant Payments", "Microfinance Apps", "Open Banking", "Buy Now Pay Later", "Remittance Platforms", "Invoice Financing", "Digital KYC", "Merchant QR Payments"]),
    ("Events", ["Conference Planning", "Speaker Selection", "Hybrid Event Formats", "Sponsorship Packages", "Networking Done Right", "Panel Discussions", "Event Follow-Up", "Venue Logistics", "Meetup Communities"]),
    ("Podcasts & Media", ["Starting a Podcast", "Interview Technique", "Video Editing Workflow", "Audience Growth", "Repurposing Content", "Studio Setup on a Budget", "Guest Outreach", "Newsletters", "Monetising Media"]),
    ("Leadership", ["Delegation", "Giving Feedback", "Remote Team Culture", "Decision Making", "Managing Up", "Building Trust", "Hard Conversations", "Strategy Offsites", "Succession Planning"]),
    ("Marketing", ["Content Calendars", "SEO for Small Business", "WhatsApp Campaigns", "Influencer Partnerships", "Brand Storytelling", "Email Open Rates", "Paid Social Budgets", "Case Study Writing", "Launch Playbooks"]),
    ("Community", ["Women in Business", "Youth Entrepreneurship", "Local Chambers of Commerce", "Volunteering Programs", "Industry Associations", "Knowledge Sharing", "Rural Enterprise", "University Partnerships", "Giving Back"]),
]

TEMPLATES = [
    "{t}: What Pakistani Businesses Need to Know",
    "How {t} Is Changing the Way We Work",
    "A Practical Guide to {t}",
    "{t} Mistakes to Avoid in 2026",
    "Lessons From the Field on {t}",
    "Why {t} Matters More Than Ever",
    "{t}: A Beginner's Playbook",
    "What We Learned About {t} This Year",
    "The Honest Case for {t}",
    "Getting Started With {t}",
    "{t} on a Small Budget",
    "Five Questions About {t}, Answered",
]

AUTHORS = ["Rai Salahuddin Ahmad", "Ayesha Khan", "Hamza Malik", "Sana Iqbal", "Bilal Ahmed", "Maryam Siddiqui"]

# Existing files under MEDIA_ROOT (see backend/media); the model stores the path.
IMAGES = [
    ("insights/article-1.webp", "Audience at a People First industry session"),
    ("insights/article-2.webp", "Panel interview at a technology event"),
    ("insights/article-3.webp", "Group photo at a chamber of commerce visit"),
    ("insights/studio/studio-audience.webp", "Audience at a business conference"),
    ("gallery/gallery1.webp", "People First team at work"),
    ("gallery/gallery2.webp", "Workshop session in progress"),
    ("gallery/gallery3.webp", "Networking at a People First event"),
]


def body(title: str, topic: str, category: str) -> str:
    return (
        f"<p>{title} is a question we hear often from founders and teams across "
        f"the {category.lower()} space. This sample article stands in for real "
        "editorial copy so the blog layout can be checked at volume.</p>"
        f"<h2>Why {topic.lower()} deserves attention</h2>"
        "<p>Small decisions compound. Teams that write down what they are "
        "trying, measure it honestly and share what they learn tend to move "
        "faster than teams that wait for a perfect plan.</p>"
        "<ul><li>Start with one clear goal and a date.</li>"
        "<li>Measure before and after, even roughly.</li>"
        "<li>Share the result with your team, good or bad.</li></ul>"
        "<h2>What to do next</h2>"
        "<p>Pick one idea from this article and try it this week. Then come "
        "back and tell us how it went.</p>"
        "<blockquote>Progress is rarely dramatic. It is usually a handful of "
        "boring habits repeated.</blockquote>"
        "<p>Want help turning this into a plan? Get in touch with the People "
        "First team.</p>"
    )


class Command(BaseCommand):
    help = "Seed the blog with sample categories and posts (idempotent)."

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=100)
        parser.add_argument("--clear", action="store_true", help="Delete seeded posts and exit.")

    @transaction.atomic
    def handle(self, *args, count, clear, **opts):
        if clear:
            n, _ = BlogPost.objects.filter(slug__startswith=SEED_PREFIX).delete()
            self.stdout.write(f"Removed {n} seeded posts (categories kept).")
            return

        cats = []
        for i, (name, topics) in enumerate(CATEGORIES, start=1):
            cat, created = BlogCategory.objects.get_or_create(
                slug=slugify(name), defaults={"name": name, "display_order": i},
            )
            cats.append((cat, topics))
            if created:
                self.stdout.write(f"+ category {name}")

        now = timezone.now()
        made = updated = 0
        for n in range(count):
            cat, topics = cats[n % len(cats)]
            topic = topics[(n // len(cats)) % len(topics)]
            title = TEMPLATES[(n * 5 + n // len(cats)) % len(TEMPLATES)].format(t=topic)
            slug = f"{SEED_PREFIX}{n + 1:03d}-{slugify(title)}"[:255]
            image, alt = IMAGES[n % len(IMAGES)]
            excerpt = (
                f"A short look at {topic.lower()} and what it means for teams "
                f"working in {cat.name.lower()} today."
            )
            post, created = BlogPost.objects.update_or_create(
                slug=slug,
                defaults={
                    "title": title,
                    "category": cat,
                    "excerpt": excerpt,
                    "content": body(title, topic, cat.name),
                    "featured_image": image,
                    "featured_image_alt": alt,
                    "author_name": AUTHORS[n % len(AUTHORS)],
                    "status": BlogPost.Status.PUBLISHED,
                    # Spread over ~10 months, newest first by n.
                    "published_at": now - timedelta(days=n * 3, hours=n % 7),
                    # Below the hand-written posts (order 0-2) but all equal, so
                    # the date decides among the seeded ones.
                    "order": 100,
                    # Plausible, repeatable sample numbers for the views display.
                    "view_count": 40 + (n * 137) % 2400,
                    "meta_title": title[:70],
                    "meta_description": excerpt[:160],
                },
            )
            made += created
            updated += not created

        self.stdout.write(self.style.SUCCESS(
            f"Posts: {made} created, {updated} updated. "
            f"Total posts {BlogPost.objects.count()}, categories {BlogCategory.objects.count()}."
        ))
