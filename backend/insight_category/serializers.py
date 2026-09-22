from rest_framework import serializers
from .models import InsightCategory, Insight

class InsightCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = InsightCategory
        fields = '__all__'

class InsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insight
        fields = '__all__'