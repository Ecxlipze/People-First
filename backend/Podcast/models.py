from django.db import models

class Podcast(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='podcasts/thumbnails/', null=True, blank=True)
    video_url = models.URLField(blank=True, null=True)
    metric_value = models.CharField(max_length=100, blank=True, null=True)
    metric_label = models.CharField(max_length=255, blank=True, null=True)
    # The coloured pill pinned to the episode thumbnail on /podcasts. Text is
    # editorial copy; the colour is stored as a hex value because the site
    # renders it as an inline style, not a Tailwind class name.
    badge = models.CharField(max_length=255, blank=True)
    badge_colour = models.CharField(
        max_length=7,
        blank=True,
        help_text="Hex colour for the thumbnail badge, e.g. #2dbe9e. "
                  "Leave blank to cycle the site's default palette.",
    )
    supporting_title = models.CharField(max_length=255, blank=True, null=True)
    supporting_content = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(
        default=False,
        help_text="Pin this episode to the featured section on /insights (up to 3).",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Auto-download YouTube thumbnail and extract duration/date if not provided
        if self.video_url and (not self.thumbnail or (not self.metric_value and not self.supporting_title)):
            try:
                from .youtube import extract_youtube_id, fetch_youtube_metadata, download_youtube_thumbnail
                video_id = extract_youtube_id(self.video_url)
                if video_id:
                    data = fetch_youtube_metadata(self.video_url)
                    if not self.thumbnail and data.get('thumbnail_url'):
                        img_data = download_youtube_thumbnail(data['thumbnail_url'])
                        if img_data:
                            from django.core.files.base import ContentFile
                            from django.utils.text import slugify
                            fname = f"{self.slug or slugify(self.title) or video_id}-thumb.jpg"
                            self.thumbnail.save(fname, ContentFile(img_data), save=False)
                    if not self.metric_value and data.get('duration'):
                        self.metric_value = data['duration']
                        if not self.metric_label:
                            self.metric_label = 'Episode Duration'
                    if not self.supporting_title and data.get('release_date'):
                        self.supporting_title = data['release_date']
                        if not self.supporting_content:
                            self.supporting_content = f"Published by {data['author']}" if data.get('author') else 'Published'
            except Exception:
                pass
        super().save(*args, **kwargs)