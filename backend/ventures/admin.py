from django import forms
from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import Venture

THEME_PRESETS = {
    "crimson": {
        "label": "Crimson (Default - Red/White gradient)",
        "accent": "#a00017",
        "border_gradient": "radial-gradient(118% 127% at 50% 50%, #FFFFFF 0%, #A00017 100%)",
    },
    "teal": {
        "label": "Teal (Teal/Green gradient)",
        "accent": "#2c8e85",
        "border_gradient": "radial-gradient(52.47% 174.19% at 50% 50%, #39CABD 0%, #246D67 100%)",
    },
    "indigo": {
        "label": "Indigo (Blue/White gradient)",
        "accent": "#2e21b6",
        "border_gradient": "radial-gradient(109% 107% at 50% 50%, #FFFFFF 0%, #2E21B6 100%)",
    },
}


class VentureAdminForm(forms.ModelForm):
    theme_preset = forms.ChoiceField(
        choices=[
            ("crimson", "Crimson (Default - Red/White gradient)"),
            ("teal", "Teal (Teal/Green gradient)"),
            ("indigo", "Indigo (Blue/White gradient)"),
            ("custom", "Custom (Specify custom accent & gradient below)"),
        ],
        required=False,
        initial="crimson",
        help_text="Choose a design-approved preset to automatically apply the border gradient and accent color.",
    )

    class Meta:
        model = Venture
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            current_accent = (self.instance.accent or "").lower()
            if current_accent == "#2c8e85":
                self.initial["theme_preset"] = "teal"
            elif current_accent == "#2e21b6":
                self.initial["theme_preset"] = "indigo"
            elif current_accent == "#a00017":
                self.initial["theme_preset"] = "crimson"
            elif current_accent:
                self.initial["theme_preset"] = "custom"

    def clean(self):
        cleaned_data = super().clean()
        preset = cleaned_data.get("theme_preset")
        if preset in THEME_PRESETS:
            preset_data = THEME_PRESETS[preset]
            cleaned_data["accent"] = preset_data["accent"]
            cleaned_data["border_gradient"] = preset_data["border_gradient"]
        elif preset == "custom":
            if not cleaned_data.get("accent"):
                cleaned_data["accent"] = "#a00017"
            if not cleaned_data.get("border_gradient"):
                cleaned_data["border_gradient"] = (
                    "radial-gradient(118% 127% at 50% 50%, #FFFFFF 0%, #A00017 100%)"
                )
        return cleaned_data


@admin.register(Venture)
class VentureAdmin(admin.ModelAdmin):
    form = VentureAdminForm
    list_display = (
        "logo_thumbnail",
        "name",
        "subtitle",
        "color_badge",
        "website_url",
        "display_order",
        "is_active",
        "created_at",
    )
    list_filter = ("is_active", "created_at")
    search_fields = ("name", "subtitle")
    list_editable = ("display_order", "is_active")
    readonly_fields = ("logo_preview", "created_at", "updated_at")
    ordering = ("display_order", "-created_at")

    fieldsets = (
        ("Venture Information", {
            "fields": ("name", "subtitle", "website_url", "logo", "logo_preview"),
        }),
        ("Card Theme & Styling", {
            "fields": ("theme_preset", "accent", "border_gradient"),
            "description": "Select a colorway preset, or pick 'Custom' to define your own hex color and radial gradient.",
        }),
        ("Display & Visibility", {
            "fields": ("display_order", "is_active", "created_at", "updated_at"),
        }),
    )

    @admin.display(description="Logo")
    def logo_thumbnail(self, obj):
        if obj.logo:
            return format_html(
                '<div style="width: 70px; height: 32px; background: #e9e9e9; border-radius: 6px; display: flex; align-items: center; justify-content: center; padding: 2px 4px;">'
                '<img src="{}" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="{}" />'
                '</div>',
                obj.logo.url,
                obj.name,
            )
        return mark_safe(
            '<div style="width: 70px; height: 32px; background: #e9e9e9; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 10px; font-weight: 500;">'
            'Placeholder'
            '</div>'
        )

    @admin.display(description="Colorway")
    def color_badge(self, obj):
        accent = obj.accent or "#a00017"
        name = "Crimson"
        if accent.lower() == "#2c8e85":
            name = "Teal"
        elif accent.lower() == "#2e21b6":
            name = "Indigo"
        elif accent.lower() != "#a00017":
            name = "Custom"
        return format_html(
            '<span style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px;">'
            '<span style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: {}; border: 1px solid rgba(0,0,0,0.1);"></span>'
            '{}'
            '</span>',
            accent,
            name,
        )

    @admin.display(description="Current Logo Preview")
    def logo_preview(self, obj):
        if obj.logo:
            return format_html(
                '<div style="width: 160px; height: 60px; background: #e9e9e9; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 6px 12px; border: 1px solid #cbd5e1;">'
                '<img src="{}" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="{}" />'
                '</div>',
                obj.logo.url,
                obj.name,
            )
        return "No logo uploaded. The card will display the clean grey placeholder plate."