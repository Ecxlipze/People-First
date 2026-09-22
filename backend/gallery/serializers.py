from rest_framework import serializers
from .models import GalleryItem

class GalleryItemSerializer(serializers.ModelSerializer):
   hasimage = serializers.SerializerMethodField()
  
   class Meta:
          model = GalleryItem
          fields = '__all__'
  
   def get_hasimage(self, obj):
          return bool(obj.image)