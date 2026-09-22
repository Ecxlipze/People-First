from django.contrib import admin
from .models import Testimonial

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("name", "handle", "display_order", "is_active", "created_at")
    search_fields = ("name", "handle", "body", "tags")
    list_filter = ("is_active", "created_at")
    list_editable = ("display_order", "is_active")
    ordering = ("display_order", "-created_at")
    readonly_fields = ("created_at", "updated_at")