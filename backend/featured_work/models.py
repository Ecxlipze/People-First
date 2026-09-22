from django.db import models

class FeaturedWork(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='featured-work/thumbnails/', null=True, blank=True)
    video_url = models.URLField(blank=True, null=True)
    metric_value = models.CharField(max_length=100, blank=True)
    metric_label = models.CharField(max_length=255, blank=True)
    secondary_metric_value = models.CharField(max_length=100, blank=True)
    secondary_metric_label = models.CharField(max_length=255, blank=True)
    bullets = models.JSONField(default=list, blank=True)
    order = models.PositiveIntegerField(default=0)
    class Meta:
        ordering = ["order"]
    def __str__(self):
        return self.title