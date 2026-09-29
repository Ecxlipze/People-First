"""Serve only artwork referenced by published content from private storage."""

from django.apps import apps
from django.core.files.storage import default_storage
from django.db.models import FileField
from django.http import FileResponse, Http404
from django.views.decorators.http import require_safe


@require_safe
def media_file(request, name):
    if name.startswith("/") or ".." in name.split("/"):
        raise Http404
    for label in ("featured_work", "gallery", "testimonial", "ventures", "Podcast", "insight_category"):
        for model in apps.get_app_config(label).get_models():
            fields = {field.name for field in model._meta.fields}
            for field in model._meta.fields:
                if not isinstance(field, FileField):
                    continue
                rows = model.objects.filter(**{field.name: name})
                if not request.user.is_staff:
                    if "is_active" in fields:
                        rows = rows.filter(is_active=True)
                    if "publish_status" in fields:
                        rows = rows.exclude(publish_status="draft")
                if rows.exists():
                    try:
                        return FileResponse(default_storage.open(name, "rb"))
                    except FileNotFoundError:
                        raise Http404 from None
    raise Http404
