from rest_framework import serializers
from .models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    hasAvatar = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = "__all__"

    def get_hasAvatar(self, obj):
        return bool(obj.avatar)

    def to_internal_value(self, data):
        ret = super().to_internal_value(data)
        tags = ret.get("tags")
        if isinstance(tags, str):
            ret["tags"] = [
                t.strip().lstrip("#")
                for t in tags.split(",")
                if t.strip()
            ]
        elif isinstance(tags, list):
            ret["tags"] = [
                str(t).strip().lstrip("#")
                for t in tags
                if str(t).strip()
            ]
        return ret

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Ensure tags is always a list of strings
        if not isinstance(data.get("tags"), list):
            data["tags"] = []
        return data