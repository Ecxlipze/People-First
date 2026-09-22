from rest_framework import viewsets
from .models import Testimonial
from .serializers import TestimonialSerializer
from .permission import IsAdminOrReadOnly

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminOrReadOnly]