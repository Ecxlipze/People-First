import logging

from django.conf import settings
from django.core.mail import EmailMessage
from rest_framework import viewsets
from .models import Inquiry
from .serializers import InquirySerializer
from .permissions import IsAdminOrCreateOnly

logger = logging.getLogger(__name__)


class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    permission_classes = [IsAdminOrCreateOnly]

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
