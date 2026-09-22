from django.db import models

class Testimonial(models.Model):
    name = models.CharField(max_length=150, help_text="Full name of the person giving the testimonial.")
    avatar = models.ImageField(
        upload_to='testimonials/',
        null=True,
        blank=True,
        help_text="Square profile photo. Recommended min 80x80px (.webp, .jpg, .png). If omitted, a colorful monogram avatar is displayed automatically.",
    )
    handle = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Social handle (e.g. @username) or role/designation.",
    )
    body = models.TextField(help_text="The testimonial quote or feedback.")
    tags = models.JSONField(
        default=list,
        blank=True,
        help_text="Keywords or hashtags. In admin, enter comma-separated values (e.g. dev, tools).",
    )
    social_url = models.URLField(
        blank=True,
        null=True,
        help_text="Direct link to the original tweet, post, or reviewer profile.",
    )
    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Determines card position in the masonry grid (0, 1, 2...).",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Uncheck to hide this testimonial from the public site without deleting it.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.name