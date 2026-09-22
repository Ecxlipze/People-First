from rest_framework import serializers
from .models import FeaturedWork

class FeaturedWorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeaturedWork
        fields = '__all__'