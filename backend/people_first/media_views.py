"""Serve only artwork referenced by published content from private storage."""

from django.apps import apps
from django.core.files.storage import default_storage
from django.db.models import FileField
from django.http import FileResponse, Http404
from django.views.decorators.http import require_safe


_FIELDS = None


def _file_fields():
    """(model, field name, has is_active, has publish_status) for every file field.

    Built once per process: walking the app registry on each /media request was
    most of this view's cost.
    """
    global _FIELDS
    if _FIELDS is None:
        found = []
        for label in ("featured_work", "gallery", "testimonial", "Podcast", "insight_category"):
            for model in apps.get_app_config(label).get_models():
                names = {field.name for field in model._meta.fields}
                for field in model._meta.fields:
                    if isinstance(field, FileField):
                        found.append((model, field.name, "is_active" in names, "publish_status" in names))
        _FIELDS = found
    return _FIELDS


@require_safe
def media_file(request, name):
    if name.startswith("/") or ".." in name.split("/"):
        raise Http404
    is_staff = request.user.is_staff
    for model, field_name, has_active, has_status in _file_fields():
        rows = model.objects.filter(**{field_name: name})
        if not is_staff:
            if has_active:
                rows = rows.filter(is_active=True)
            if has_status:
                rows = rows.exclude(publish_status="draft")
        if rows.exists():
            try:
                response = FileResponse(default_storage.open(name, "rb"))
            except FileNotFoundError:
                raise Http404 from None
            # Short browser/CDN cache: repeat views skip the database and blob
            # fetch, while a deleted image still disappears within minutes.
            # Staff previews are never cached.
            response["Cache-Control"] = "private, no-store" if is_staff else "public, max-age=300"
            return response
    raise Http404
