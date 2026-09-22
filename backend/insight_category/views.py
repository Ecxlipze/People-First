from rest_framework import viewsets
from .models import InsightCategory, Insight
from .serializers import InsightCategorySerializer, InsightSerializer
from .permissions import IsAdminOrReadOnly

class InsightCategoryViewSet(viewsets.ModelViewSet):
    queryset = InsightCategory.objects.all()
    serializer_class = InsightCategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class InsightViewSet(viewsets.ModelViewSet):
    queryset = Insight.objects.all()
    serializer_class = InsightSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Insight.objects.all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        return queryset