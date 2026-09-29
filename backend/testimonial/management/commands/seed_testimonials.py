from django.core.management.base import BaseCommand
from testimonial.models import Testimonial

LEGACY_MOCKUP_NAMES = [
    "Darrell Steward",
    "Guy Hawkins",
    "Leslie Alexander",
    "Marvin McKinney",
    "Jenny Wilson",
    "Annette Black",
    "Kristin Watson",
    "Floyd Miles",
]

SEED_DATA = [
    {
        "name": "Ayesha Khan",
        "handle": "Trainee, Digital Skills Program",
        "body": "The training was practical from day one. I learned skills I could use right away and now take on remote work with confidence.",
        "tags": ["digital_skills", "training"],
    },
    {
        "name": "Hassan Raza",
        "handle": "Small Business Owner",
        "body": "People First helped us get online and reach customers directly. Fewer middlemen and better margins made a real difference.",
        "tags": ["direct_commerce", "growth"],
    },
    {
        "name": "Sana Malik",
        "handle": "Freelancer",
        "body": "A supportive team and a clear path from learning to earning. I would recommend it to anyone starting out.",
        "tags": ["remote_work", "learning"],
    },
    {
        "name": "Usman Tariq",
        "handle": "Partner Organisation",
        "body": "Working with the team was smooth and professional. They understand local needs and deliver on what they promise.",
        "tags": ["partnership", "impact"],
    },
    {
        "name": "Fatima Zahra",
        "handle": "University Graduate",
        "body": "The programs bridge the gap between what we study and what industry needs. It gave me direction and real confidence.",
        "tags": ["youth", "careers"],
    },
    {
        "name": "Bilal Ahmed",
        "handle": "Entrepreneur",
        "body": "From idea to launch, the guidance was honest and useful. It feels like a team that genuinely wants you to succeed.",
        "tags": ["startups", "mentorship"],
    },
    {
        "name": "Hira Nadeem",
        "handle": "Content Creator",
        "body": "The studio and podcast support helped me find my voice and grow an audience I am proud of.",
        "tags": ["podcast", "creators"],
    },
    {
        "name": "Imran Sheikh",
        "handle": "Community Leader",
        "body": "Digital tools are finally reaching people who were left behind. This work is opening real doors in our community.",
        "tags": ["inclusion", "community"],
    },
]

class Command(BaseCommand):
    help = "Seed generic placeholder testimonials (replacing the legacy mockup set)."

    def handle(self, *args, **options):
        removed, _ = Testimonial.objects.filter(name__in=LEGACY_MOCKUP_NAMES).delete()
        if removed:
            self.stdout.write(self.style.WARNING(f"Removed {removed} legacy mockup testimonials."))

        seeded_count = 0
        for i, item in enumerate(SEED_DATA):
            testimonial, created = Testimonial.objects.update_or_create(
                name=item["name"],
                defaults={
                    "handle": item["handle"],
                    "body": item["body"],
                    "tags": item["tags"],
                    "display_order": i,
                    "is_active": True,
                },
            )
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"  [{action}] {testimonial.name} (order: {i})"))
            seeded_count += 1

        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully seeded {seeded_count} testimonials!"))
