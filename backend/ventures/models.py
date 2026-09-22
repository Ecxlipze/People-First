from django.db import models

class Venture(models.Model):
    logo = models.ImageField(upload_to='ventures/',null=True,blank=True)
    name = models.CharField(max_length=150)
    subtitle = models.CharField(max_length=255,blank=True,null=True)
    website_url = models.URLField(blank=True,null=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-created_at']
    def __str__(self):
        return self.name