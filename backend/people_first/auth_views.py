from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView


class ThrottledTokenObtainPairView(TokenObtainPairView):
    """/api/token/ with a brute-force limit (rate set in REST_FRAMEWORK settings)."""
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "token"
