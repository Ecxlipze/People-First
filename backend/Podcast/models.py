from django.db import models

class Podcast(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='podcasts/thumbnails/', null=True, blank=True)
    video_url = models.URLField(blank=True, null=True)
    metric_value = models.CharField(max_length=100, blank=True, null=True)
    metric_label = models.CharField(max_length=255, blank=True, null=True)
    supporting_title = models.CharField(max_length=255, blank=True, null=True)
    supporting_content = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title