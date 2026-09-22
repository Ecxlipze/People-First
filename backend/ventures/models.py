from django.db import models

class Venture(models.Model):
    logo = models.ImageField(upload_to='ventures/',null=True,blank=True)
    name = models.CharField(max_length=150)
    subtitle = models.CharField(max_length=255,blank=True,null=True)
    website_url = models.URLField(blank=True,null=True)
    # Card ring colour and the radial gradient behind the border. Both were
    # sampled from the HOME3.pdf mockup, which uses exactly three colourways
    # across its nine cards; see frontend/app/components/ventures.ts for the
    # sampling notes. Blank falls back to the site's default (crimson).
    accent = models.CharField(
        max_length=7,
        blank=True,
        help_text="Hex ring/border colour, e.g. #2c8e85.",
    )
    border_gradient = models.CharField(
        max_length=255,
        blank=True,
        help_text="Full CSS radial-gradient(...) for the card border.",
    )
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-created_at']
    def __str__(self):
        return self.name