from django.db import models

class Venture(models.Model):
    logo = models.ImageField(
        upload_to='ventures/',
        null=True,
        blank=True,
        help_text="Venture logo (recommended transparent PNG/WebP, max ~200x72px). If omitted, an empty grey plate is displayed.",
    )
    name = models.CharField(
        max_length=150,
        help_text="Venture name (e.g. Merchanity, Abaad.pk).",
    )
    subtitle = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Short tagline or domain description (e.g. Digital Commerce Solutions).",
    )
    website_url = models.URLField(
        blank=True,
        null=True,
        help_text="External website URL (e.g. https://merchanity.com). Leave empty if site is not yet live.",
    )
    accent = models.CharField(
        max_length=7,
        blank=True,
        help_text="Hex ring/border colour (e.g. #2c8e85 for teal, #a00017 for crimson, #2e21b6 for indigo).",
    )
    border_gradient = models.CharField(
        max_length=255,
        blank=True,
        help_text="Full CSS radial-gradient(...) for the card border. Auto-populated when using theme presets in admin.",
    )
    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Position in the grid (0 to 8). Desktop places 5 on the top row, 4 on the second row.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Uncheck to hide this venture from the public site without deleting it.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-created_at']
    def __str__(self):
        return self.name