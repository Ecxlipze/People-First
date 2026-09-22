from django import forms
from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import FeaturedWork


class FeaturedWorkAdminForm(forms.ModelForm):
    bullets = forms.CharField(
        widget=forms.Textarea(attrs={"rows": 5}),
        required=False,
        help_text="One bullet per line (or comma-separated). Used primarily on Block 2 (Tech Events).",
    )

    class Meta:
        model = FeaturedWork
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk and isinstance(self.instance.bullets, list):
            self.initial["bullets"] = "\n".join(self.instance.bullets)

    def clean_bullets(self):
        raw = self.cleaned_data.get("bullets", "")
        if not raw:
            return []
        if isinstance(raw, list):
            return [str(b).strip() for b in raw if str(b).strip()]
        # Split on newlines or commas
        lines = [line.strip() for line in raw.replace(",", "\n").split("\n") if line.strip()]
        return lines


@admin.register(FeaturedWork)
class FeaturedWorkAdmin(admin.ModelAdmin):
    form = FeaturedWorkAdminForm
    list_display = (
        "thumbnail_preview",
        "title_preview",
        "block_name",
        "metric_value",
        "secondary_metric_value",
        "order",
    )
    search_fields = ("title", "description")
    list_editable = ("order",)
    ordering = ("order",)
    readonly_fields = ("thumbnail_detail_preview",)

    fieldsets = (
        ("Block Placement", {
            "fields": ("order",),
            "description": "Set 0 for Block 1 (Cinematic Podcast Stage), 1 for Block 2 (Tech Events Management).",
        }),
        ("Content & Copy", {
            "fields": ("title", "description"),
        }),
        ("Media & Video", {
            "fields": ("thumbnail", "thumbnail_detail_preview", "video_url"),
        }),
        ("Primary Metric", {
            "fields": ("metric_value", "metric_label"),
            "description": "Large bold metric (e.g. 80% Increased Performance Rate, or 30% management skills).",
        }),
        ("Secondary Metric Card", {
            "fields": ("secondary_metric_value", "secondary_metric_label"),
            "description": "Overhanging stat card (e.g. 27% have knowledge..., or 45% Productivity events...).",
        }),
        ("Bullet Points (Block 2)", {
            "fields": ("bullets",),
            "description": "Two-column checklist displayed under the copy on Block 2 (Tech Events).",
        }),
    )

    @admin.display(description="Block")
    def block_name(self, obj):
        if obj.order == 0:
            return "Block 1 (Podcast Stage)"
        elif obj.order == 1:
            return "Block 2 (Tech Events)"
        return f"Block (order {obj.order})"

    @admin.display(description="Title")
    def title_preview(self, obj):
        return obj.title.replace("\n", " ")

    @admin.display(description="Thumbnail")
    def thumbnail_preview(self, obj):
        if obj.thumbnail:
            return format_html(
                '<img src="{}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px; border: 1px solid #e2e8f0;" alt="{}" />',
                obj.thumbnail.url,
                obj.title,
            )
        return mark_safe('<span style="color: #94a3b8; font-size: 11px;">Default photo</span>')

    @admin.display(description="Current Photo Preview")
    def thumbnail_detail_preview(self, obj):
        if obj.thumbnail:
            return format_html(
                '<div style="margin-top: 4px;">'
                '<img src="{}" style="max-width: 280px; max-height: 200px; object-fit: cover; border-radius: 8px; border: 1px solid #cbd5e1;" alt="{}" />'
                '</div>',
                obj.thumbnail.url,
                obj.title,
            )
        return "No photo uploaded. The website will display the default design still."