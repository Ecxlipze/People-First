from rest_framework import serializers
from .models import Venture

class VentureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venture
        fields = '__all__'