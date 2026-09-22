from django.db import models

class Testimonial(models.Model):
    name = models.CharField(max_length=150)
    avatar = models.ImageField(upload_to='testimonials/', null=True, blank=True)
    handle = models.CharField(max_length=255, blank=True, null=True)
    body = models.TextField()
    tags = models.JSONField(default=list, blank=True)
    social_url = models.URLField(blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.name