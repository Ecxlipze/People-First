from rest_framework import viewsets
from .models import InsightCategory, Insight
from .serializers import InsightCategorySerializer, InsightSerializer
from .permissions import IsAdminOrReadOnly
from people_first.visibility import PublicVisibilityMixin


class InsightCategoryViewSet(PublicVisibilityMixin, viewsets.ModelViewSet):
    queryset = InsightCategory.objects.all()
    serializer_class = InsightCategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class InsightViewSet(PublicVisibilityMixin, viewsets.ModelViewSet):
    queryset = Insight.objects.all()
    serializer_class = InsightSerializer
    permission_classes = [IsAdminOrReadOnly]

    # An Insight has no is_active flag; "visible to the public" means published.
    # Without this, anonymous callers could read every unfinished draft.
    public_filters = {"publish_status": Insight.PublishStatus.PUBLISHED}

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        return queryset
