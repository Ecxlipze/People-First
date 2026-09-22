from django.contrib import admin
from .models import InsightCategory ,Insight

@admin.register(InsightCategory)
class InsightCategoryAdmin(admin.ModelAdmin):

    list_display = ("name","slug","display_order","is_active",)
    list_filter = ("is_active",)
    search_fields = ("name","slug",)
    list_editable = ("display_order","is_active",)
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("display_order",)
    fields = ("name","slug","display_order","is_active",)


@admin.register(Insight)
class InsightAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "metric", "card_value", "order", "publish_status", "created_at")
    search_fields = ("title", "summary", "content", "metric", "metric_label", "card_value", "card_label")
    list_filter = ("publish_status",  "category")
    list_editable = ("order", "publish_status")
    ordering = ("order", "-created_at")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")