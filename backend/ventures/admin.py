from django.contrib import admin
from .models import Venture

@admin.register(Venture)
class VentureAdmin(admin.ModelAdmin):
    list_display = ("name","subtitle","website_url","display_order","is_active","created_at",)
    list_filter = ("is_active","created_at",)
    search_fields = ("name","subtitle",)
    list_editable = ("display_order","is_active",)
    readonly_fields = ("created_at","updated_at",)
    ordering = ("display_order","-created_at",)
    fields = ("logo","name","subtitle","website_url","display_order","is_active","created_at","updated_at",)