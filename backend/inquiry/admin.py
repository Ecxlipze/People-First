from django.contrib import admin
from .models import Inquiry

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "inquiry_type", "person_type", "created_at")
    search_fields = ("name", "email", "phone", "message")
    list_filter = ("inquiry_type", "person_type", "created_at")
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)