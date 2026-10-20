from rest_framework import serializers
from .models import Inquiry


class InquirySerializer(serializers.ModelSerializer):
    """The public form's serializer: only what a visitor may send, and the same
    response shape as before. `status` and `staff_notes` are deliberately absent
    so an anonymous POST can neither set them nor see them."""

    class Meta:
        model = Inquiry
        fields = ["id", "name", "email", "phone", "message", "person_type", "inquiry_type", "created_at"]
        read_only_fields = ["id", "created_at"]


class InquiryStaffSerializer(serializers.ModelSerializer):
    """What the CMS inbox sees. Staff can change only the handling state and
    notes; the visitor's own words are read-only."""

    inquiry_type_label = serializers.CharField(source="get_inquiry_type_display", read_only=True)
    person_type_label = serializers.CharField(source="get_person_type_display", read_only=True)

    class Meta:
        model = Inquiry
        fields = [
            "id", "name", "email", "phone", "message", "person_type", "inquiry_type",
            "inquiry_type_label", "person_type_label", "created_at", "status", "staff_notes",
        ]
        read_only_fields = [
            "id", "name", "email", "phone", "message", "person_type", "inquiry_type", "created_at",
        ]
