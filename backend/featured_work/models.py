from django.db import models

class FeaturedWork(models.Model):
    title = models.CharField(
        max_length=255,
        help_text="Block title/headline. Newlines create line breaks in the design (e.g. 'Tech Events\\nManagement.').",
    )
    description = models.TextField(
        help_text="Summary description paragraph.",
    )
    thumbnail = models.ImageField(
        upload_to='featured-work/thumbnails/',
        null=True,
        blank=True,
        help_text="Block photo (.webp/.jpg/.png). Block 1 aspect is ~0.7 (portrait), Block 2 aspect is 0.8.",
    )
    video_url = models.URLField(
        blank=True,
        null=True,
        help_text="Optional YouTube or video link.",
    )
    metric_value = models.CharField(
        max_length=100,
        blank=True,
        help_text="Primary metric value (e.g. '80%' for Block 1, '30%' for Block 2).",
    )
    metric_label = models.CharField(
        max_length=255,
        blank=True,
        help_text="Primary metric label (e.g. 'Increased Performance Rate' or 'management skills').",
    )
    secondary_metric_value = models.CharField(
        max_length=100,
        blank=True,
        help_text="Secondary metric value on the overlapping card (e.g. '27%' or '45%').",
    )
    secondary_metric_label = models.CharField(
        max_length=255,
        blank=True,
        help_text="Secondary metric label (e.g. 'have knowledge about market strategies.' or 'Productivity events all over Pakistan').",
    )
    bullets = models.JSONField(
        default=list,
        blank=True,
        help_text="Bullet points list. Enter one per line in admin. Used primarily on Block 2 (Tech Events).",
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="0 for Block 1 (Podcast: market strategy), 1 for Block 2 (Tech Events Management).",
    )
    class Meta:
        ordering = ["order"]
    def __str__(self):
        return self.title