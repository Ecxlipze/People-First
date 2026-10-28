"""Tell the Next.js site to drop its cached copy of a content type.

The site caches API reads (CONTENT_REVALIDATE_SECONDS) and is only told about
edits made through its own CMS. Edits in the Django admin would otherwise show
up only when that timer runs out, so a save or delete here pings the site's
/api/revalidate. Best-effort: with FRONTEND_REVALIDATE_URL or REVALIDATE_SECRET
unset it does nothing, and a failure is logged but never breaks the admin save.
"""
import json
import logging
import urllib.request

from django.conf import settings
from django.db import transaction
from django.db.models.signals import post_delete, post_save

logger = logging.getLogger(__name__)

# model label -> the cache tags (see frontend/app/lib/content/tags.ts) it feeds.
TAGS_BY_MODEL = {
    "blog.BlogPost": ["content:blog-posts"],
    "blog.BlogCategory": ["content:blog-categories", "content:blog-posts"],
    "Podcast.Podcast": ["content:podcasts"],
    "gallery.GalleryItem": ["content:gallery"],
    "testimonial.Testimonial": ["content:testimonials"],
    "featured_work.FeaturedWork": ["content:featured-work"],
}


def _notify(tags):
    url = getattr(settings, "FRONTEND_REVALIDATE_URL", "")
    secret = getattr(settings, "REVALIDATE_SECRET", "")
    if not url or not secret:
        return
    request = urllib.request.Request(
        url,
        data=json.dumps({"tags": tags}).encode(),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {secret}"},
        method="POST",
    )
    try:
        urllib.request.urlopen(request, timeout=3).close()
    except Exception:
        logger.warning("Could not refresh the site cache for %s", tags, exc_info=True)


def _on_change(sender, update_fields=None, **kwargs):
    # The YouTube sync refreshes view counts hourly; the cache timer covers that.
    if update_fields and set(update_fields) <= {"view_count", "updated_at"}:
        return
    tags = TAGS_BY_MODEL.get(sender._meta.label)
    if tags:
        # After commit, so the site never re-reads the row before it is saved.
        transaction.on_commit(lambda: _notify(tags))


def connect():
    from django.apps import apps

    for label in TAGS_BY_MODEL:
        model = apps.get_model(label)
        post_save.connect(_on_change, sender=model, dispatch_uid=f"pf-reval-save-{label}")
        post_delete.connect(_on_change, sender=model, dispatch_uid=f"pf-reval-del-{label}")
