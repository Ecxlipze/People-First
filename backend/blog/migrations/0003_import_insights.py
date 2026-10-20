"""Copy every Insight (and its category) into the blog tables.

Insights are now blog posts: Media / Events and Ideas Lab read from BlogPost.
The old insight_category tables are left in place, untouched, as a backup.
"""
import nh3
from django.db import migrations
from django.utils.html import escape

ALLOWED_TAGS = {"p", "br", "h2", "h3", "ul", "ol", "li", "strong", "em", "a"}


def as_html(text):
    text = (text or "").strip()
    if "<" in text:  # already markup
        return nh3.clean(text, tags=ALLOWED_TAGS, attributes={"a": {"href"}}, link_rel="noopener noreferrer")
    return "".join(f"<p>{escape(p.strip())}</p>" for p in text.split("\n\n") if p.strip())


def forwards(apps, schema_editor):
    Insight = apps.get_model("insight_category", "Insight")
    InsightCategory = apps.get_model("insight_category", "InsightCategory")
    BlogPost = apps.get_model("blog", "BlogPost")
    BlogCategory = apps.get_model("blog", "BlogCategory")

    categories = {}
    for c in InsightCategory.objects.all():
        categories[c.pk], _ = BlogCategory.objects.get_or_create(
            slug=c.slug,
            defaults={"name": c.name, "display_order": c.display_order, "is_active": c.is_active},
        )

    for i in Insight.objects.all():
        slug = i.slug
        if BlogPost.objects.filter(slug=slug).exists():
            continue  # already imported (re-run) or a post already owns this URL
        published = i.publish_status == "published"
        BlogPost.objects.create(
            title=i.title,
            slug=slug,
            category=categories.get(i.category_id),
            excerpt=i.summary,
            content=as_html(i.content),
            featured_image=i.thumbnail.name if i.thumbnail else None,
            featured_image_alt=i.thumbnail_alt or "",
            studio_image=i.studio_thumbnail.name if i.studio_thumbnail else None,
            studio_image_alt=i.studio_thumbnail_alt or "",
            metric=i.metric or "",
            metric_label=i.metric_label or "",
            card_value=i.card_value or "",
            card_label=i.card_label or "",
            video_url=i.video_url or "",
            order=i.order,
            status="published" if published else "draft",
            published_at=i.created_at if published else None,
        )


class Migration(migrations.Migration):
    dependencies = [
        ("blog", "0002_media_events_fields"),
        ("insight_category", "0005_alter_insight_slug"),
    ]
    operations = [migrations.RunPython(forwards, migrations.RunPython.noop)]
