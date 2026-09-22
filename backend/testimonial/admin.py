from django.contrib import admin
from django import forms
from django.utils.html import format_html
from .models import Testimonial


class TestimonialAdminForm(forms.ModelForm):
    tags = forms.CharField(
        required=False,
        help_text="Comma-separated keywords or hashtags (e.g. dev, tools, postcrafts). Leading '#' is stripped automatically.",
    )

    class Meta:
        model = Testimonial
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk and isinstance(self.instance.tags, list):
            self.initial["tags"] = ", ".join(self.instance.tags)

    def clean_tags(self):
        raw_tags = self.cleaned_data.get("tags", "")
        if not raw_tags:
            return []
        if isinstance(raw_tags, list):
            return [str(t).strip().lstrip("#") for t in raw_tags if str(t).strip()]
        # Split on commas, strip whitespace and leading '#'
        return [
            tag.strip().lstrip("#")
            for tag in raw_tags.split(",")
            if tag.strip()
        ]


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    form = TestimonialAdminForm
    list_display = (
        "avatar_thumbnail",
        "name",
        "handle",
        "tag_list",
        "display_order",
        "is_active",
        "created_at",
    )
    search_fields = ("name", "handle", "body")
    list_filter = ("is_active", "created_at")
    list_editable = ("display_order", "is_active")
    ordering = ("display_order", "-created_at")
    readonly_fields = ("avatar_preview", "created_at", "updated_at")

    fieldsets = (
        ("Reviewer Info", {
            "fields": ("name", "handle", "avatar", "avatar_preview", "social_url"),
        }),
        ("Testimonial Content", {
            "fields": ("body", "tags"),
        }),
        ("Display & Visibility", {
            "fields": ("display_order", "is_active", "created_at", "updated_at"),
        }),
    )

    @admin.display(description="Avatar")
    def avatar_thumbnail(self, obj):
        if obj.avatar:
            return format_html(
                '<img src="{}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" alt="{}" />',
                obj.avatar.url,
                obj.name,
            )
        initials = "".join([part[0].upper() for part in obj.name.split()[:2]]) or "?"
        return format_html(
            '<span style="display:inline-flex; align-items:center; justify-content:center; width: 36px; height: 36px; border-radius: 50%; background: #4f6ef7; color: #ffffff; font-size: 13px; font-weight: bold;">{}</span>',
            initials,
        )

    @admin.display(description="Current Avatar Preview")
    def avatar_preview(self, obj):
        if obj.avatar:
            return format_html(
                '<img src="{}" style="max-width: 140px; max-height: 140px; border-radius: 8px; object-fit: cover; border: 1px solid #cbd5e1;" alt="{}" />',
                obj.avatar.url,
                obj.name,
            )
        return "No avatar uploaded. The website will display a generated gradient monogram avatar."

    @admin.display(description="Tags")
    def tag_list(self, obj):
        if obj.tags and isinstance(obj.tags, list):
            return ", ".join(f"#{t}" for t in obj.tags)
        return "-"