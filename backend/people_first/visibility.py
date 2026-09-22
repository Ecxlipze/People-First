"""Shared queryset scoping for the public content APIs.

Every content viewset is a ModelViewSet whose read endpoints are public, so the
same queryset serves the marketing site and the admin UI. Without scoping, rows
an editor has deliberately switched off — `is_active=False`, or an Insight still
in `draft` — are served to anonymous callers alongside the live ones.

Staff keep the unfiltered queryset so the admin can still see and edit them.
"""


def is_staff_request(request):
    user = getattr(request, "user", None)
    return bool(user and user.is_authenticated and user.is_staff)


class PublicVisibilityMixin:
    """Hide switched-off rows from everyone except staff.

    Set ``public_filters`` to the lookups that define "visible to the public".
    """

    public_filters = {"is_active": True}

    def get_queryset(self):
        queryset = super().get_queryset()
        if is_staff_request(self.request):
            return queryset
        return queryset.filter(**self.public_filters)
