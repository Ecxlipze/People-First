from rest_framework import serializers
from .models import FeaturedWork


class FeaturedWorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeaturedWork
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not isinstance(data.get("bullets"), list):
            data["bullets"] = []
        return data