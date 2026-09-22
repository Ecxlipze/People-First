from django.contrib import admin
from .models import Podcast

@admin.register(Podcast)
class PodcastAdmin(admin.ModelAdmin):
    list_display = ("title", "badge", "metric_value", "metric_label", "supporting_title", "order", "is_active", "created_at")
    search_fields = ("title", "description", "badge", "metric_label", "supporting_title", "supporting_content")
    list_filter = ("is_active", "created_at")
    list_editable = ("order", "is_active")
    ordering = ("order", "-created_at")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")