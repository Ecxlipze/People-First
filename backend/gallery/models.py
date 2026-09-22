from django.db import models

class GalleryItem(models.Model):
    image = models.ImageField(upload_to="gallery/")
    title = models.CharField(max_length=255,blank=True)
    caption = models.TextField(blank=True)
    alt_text = models.CharField(max_length=255,blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    class Meta:
        ordering = ["display_order"]
    def __str__(self):
        return self.title or "Gallery Item"