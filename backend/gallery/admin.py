from django.contrib import admin
from .models import GalleryItem


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "image",
        "display_order",
        "is_active",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "title",
        "caption",
        "alt_text",
    )

    list_editable = (
        "display_order",
        "is_active",
    )

    ordering = (
        "display_order",
    )

    fields = (
        "image",
        "title",
        "caption",
        "alt_text",
        "display_order",
        "is_active",
    )