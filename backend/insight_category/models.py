from django.db import models

class InsightCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order']
    def __str__(self):
        return self.name



class Insight(models.Model):
    class PublishStatus(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'

    category = models.ForeignKey(InsightCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='insights')
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    summary = models.TextField()
    content = models.TextField()
    metric = models.CharField(max_length=100, blank=True, null=True)
    metric_label = models.CharField(max_length=255, blank=True, null=True)
    card_value = models.CharField(max_length=100, blank=True, null=True)
    card_label = models.CharField(max_length=255, blank=True, null=True)
    thumbnail = models.ImageField(upload_to='insights/', null=True, blank=True)
    thumbnail_alt = models.CharField(max_length=255, blank=True, null=True)
    studio_thumbnail = models.ImageField(upload_to='insights/studio/', null=True, blank=True)
    studio_thumbnail_alt = models.CharField(max_length=255, blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    publish_status = models.CharField(max_length=20, choices=PublishStatus.choices, default=PublishStatus.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title