from django.db import models

class Inquiry(models.Model):
    INQUIRY_TYPES = [
        ("contact_us", "Contact Us"),
        ("partner_with_us", "Partner With Us"),
        ("book_consultation", "Book a Consultation"),
        ("join_training", "Join a Training Program"),
    ]

    PERSON_TYPES = [
        ("entrepreneur", "Entrepreneur / Business Owner"),
        ("student", "Student"),
        ("job_seeker", "Job Seeker"),
        ("training_partner", "Training Partner"),
        ("investor", "Investor"),
        ("media_guest", "Media / Podcast Guest"),
        ("other", "Other"),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    message = models.TextField()
    person_type = models.CharField(max_length=20, choices=PERSON_TYPES, default="other")
    inquiry_type = models.CharField(max_length=30, choices=INQUIRY_TYPES, default="contact_us")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name}"