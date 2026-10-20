from django.contrib import admin
from django_summernote.admin import SummernoteModelAdmin

from .models import BlogCategory, BlogPost


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "display_order", "is_active")
    list_editable = ("display_order", "is_active")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.action(description="Publish selected posts")
def publish(modeladmin, request, queryset):
    for post in queryset.exclude(status=BlogPost.Status.PUBLISHED):
        post.status = BlogPost.Status.PUBLISHED
        post.save()  # save() stamps published_at


@admin.action(description="Unpublish selected posts (back to draft)")
def unpublish(modeladmin, request, queryset):
    queryset.update(status=BlogPost.Status.DRAFT)


@admin.register(BlogPost)
class BlogPostAdmin(SummernoteModelAdmin):
    summernote_fields = ("content",)
    list_display = ("title", "category", "status", "published_at", "order", "updated_at")
    list_filter = ("status", "category")
    search_fields = ("title", "excerpt", "content")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "published_at"
    actions = [publish, unpublish]
    fieldsets = (
        ("Post", {"fields": ("title", "slug", "category", "author_name", "excerpt", "content")}),
        ("Featured image", {"fields": ("featured_image", "featured_image_alt")}),
        ("Media / Events feature card (optional)", {
            "fields": ("metric", "metric_label", "card_value", "card_label",
                       "studio_image", "studio_image_alt", "video_url"),
            "classes": ("collapse",),
            "description": "Optional. The red headline metric, teal stat card and wide image used in the "
                           "Media / Events layout. Leave blank for an ordinary article.",
        }),
        ("Publishing", {
            "fields": ("status", "published_at", "order"),
            "description": "Leave as Draft to save without publishing. Choosing Published makes the post live "
                           "on /blog within minutes; a future date schedules it.",
        }),
        ("SEO", {"fields": ("meta_title", "meta_description")}),
        ("Timestamps", {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )
