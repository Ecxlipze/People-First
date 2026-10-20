import csv
import logging

from django.conf import settings
from django.core.mail import EmailMessage
from django.db.models import Count, Q
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .models import Inquiry
from .serializers import InquirySerializer, InquiryStaffSerializer
from .permissions import IsAdminOrCreateOnly

logger = logging.getLogger(__name__)


class InboxPagination(PageNumberPagination):
    page_size = 25


def _csv_safe(value) -> str:
    """Stop spreadsheet formula injection: a cell starting with = + - @ would run
    as a formula when opened in Excel/Sheets."""
    text = "" if value is None else str(value)
    return "'" + text if text[:1] in ("=", "+", "-", "@", "\t", "\r") else text


class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all()
    permission_classes = [IsAdminOrCreateOnly]
    pagination_class = InboxPagination
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_serializer_class(self):
        # Visitors post through the narrow serializer; everything staff sees or
        # edits goes through the staff one.
        return InquirySerializer if self.action == "create" else InquiryStaffSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params
        if status := params.get("status"):
            queryset = queryset.filter(status=status)
        if kind := params.get("type"):
            queryset = queryset.filter(inquiry_type=kind)
        if q := params.get("q", "").strip():
            queryset = queryset.filter(
                Q(name__icontains=q) | Q(email__icontains=q) | Q(phone__icontains=q) | Q(message__icontains=q)
            )
        return queryset

    @action(detail=False, methods=["get"])
    def summary(self, request):
        """Counts per status, for the inbox tabs and the unread badge."""
        counts = dict(Inquiry.objects.values_list("status").annotate(n=Count("id")))
        return Response({
            "total": sum(counts.values()),
            **{key: counts.get(key, 0) for key, _ in Inquiry.STATUSES},
        })

    @action(detail=False, methods=["get"])
    def export(self, request):
        """CSV of the inquiries matching the current filters (all pages)."""
        response = HttpResponse(content_type="text/csv; charset=utf-8")
        response["Content-Disposition"] = 'attachment; filename="inquiries.csv"'
        response.write("\ufeff")  # BOM so Excel reads UTF-8 (Urdu names etc.) correctly
        writer = csv.writer(response)
        writer.writerow(["Received", "Name", "Email", "Phone", "Type", "Person", "Status", "Message", "Notes"])
        for i in self.get_queryset():
            writer.writerow([
                _csv_safe(i.created_at.strftime("%Y-%m-%d %H:%M")), _csv_safe(i.name), _csv_safe(i.email),
                _csv_safe(i.phone), _csv_safe(i.get_inquiry_type_display()), _csv_safe(i.get_person_type_display()),
                _csv_safe(i.get_status_display()), _csv_safe(i.message), _csv_safe(i.staff_notes),
            ])
        return response

    def perform_create(self, serializer):
        inquiry = serializer.save()
        self._send_confirmation(inquiry)

    def _send_confirmation(self, inquiry):
        """Acknowledge the inquiry by email.

        The inquiry is already persisted by this point, so a mail failure must
        not fail the request: the website form would show the visitor an error
        and invite a duplicate submission for a message we did in fact receive.
        Log it instead and let the 201 stand.
        """
        email = EmailMessage(
            subject="Inquiry Received",
            body=(
                f"Hello {inquiry.name},\n\n"
                "We have received your inquiry successfully.\n\n"
                f"Your message:\n{inquiry.message}\n\n"
                "Thank you for contacting us."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[inquiry.email],
            reply_to=[inquiry.email],
        )
        try:
            email.send(fail_silently=False)
        except Exception:
            logger.exception(
                "Failed to send confirmation email for inquiry %s", inquiry.pk
            )
