from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import GalleryItem


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = (
        "image_thumbnail",
        "title",
        "alt_text",
        "display_order",
        "is_active",
    )
    list_filter = ("is_active",)
    search_fields = ("title", "caption", "alt_text")
    list_editable = ("display_order", "is_active")
    ordering = ("display_order",)
    readonly_fields = ("image_preview",)

    fieldsets = (
        ("Photograph", {
            "fields": ("image", "image_preview"),
        }),
        ("Information & Accessibility", {
            "fields": ("title", "alt_text", "caption"),
            "description": "Accessibility and metadata for the photo. At least alt_text or title is recommended.",
        }),
        ("Display & Visibility", {
            "fields": ("display_order", "is_active"),
        }),
    )

    @admin.display(description="Preview")
    def image_thumbnail(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 44px; height: 66px; object-fit: cover; border-radius: 4px; border: 1px solid #e2e8f0;" alt="{}" />',
                obj.image.url,
                obj.alt_text or obj.title or "Gallery item",
            )
        return mark_safe('<span style="color: #94a3b8; font-size: 12px;">No image</span>')

    @admin.display(description="Current Photo Preview")
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<div style="margin-top: 4px;">'
                '<img src="{}" style="max-width: 240px; max-height: 380px; object-fit: cover; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);" alt="{}" />'
                '</div>',
                obj.image.url,
                obj.alt_text or obj.title or "Gallery item",
            )
        return "No image uploaded yet."