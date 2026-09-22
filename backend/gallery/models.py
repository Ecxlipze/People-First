from django.db import models

class GalleryItem(models.Model):
    image = models.ImageField(
        upload_to="gallery/",
        help_text="Gallery photograph. Recommended portrait ratio ~0.59 (e.g. 400x675px or 1200x2025px). Images are centered and cropped cleanly by the coverflow carousel.",
    )
    title = models.CharField(
        max_length=255,
        blank=True,
        help_text="Optional title for internal organization or fallback accessibility description.",
    )
    caption = models.TextField(
        blank=True,
        help_text="Optional caption or notes about the photograph.",
    )
    alt_text = models.CharField(
        max_length=255,
        blank=True,
        help_text="Accessible description for screen readers and SEO. If left blank, title or caption is used.",
    )
    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Determines slide order in the coverflow carousel (0, 1, 2...).",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Uncheck to hide this image from the public gallery without deleting it.",
    )

    class Meta:
        ordering = ["display_order"]

    def __str__(self):
        return self.title or self.alt_text or f"Gallery Item #{self.id or 'new'}"