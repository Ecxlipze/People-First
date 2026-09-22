from django.contrib import admin
from .models import FeaturedWork

@admin.register(FeaturedWork)
class FeaturedWorkAdmin(admin.ModelAdmin):
    list_display = ("title", "metric_value", "metric_label", "secondary_metric_value", "secondary_metric_label", "order")
    search_fields = ("title", "description")
    list_editable = ("order",)
    ordering = ("order",)
    fields = ("title", "description", "thumbnail", "video_url", "metric_value", "metric_label", "secondary_metric_value", "secondary_metric_label", "bullets", "order")