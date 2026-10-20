
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from people_first.auth_views import ThrottledTokenObtainPairView
from people_first.media_views import media_file

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/token/', ThrottledTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/',include('featured_work.urls')),
    path('api/', include('ventures.urls')),
    path('api/', include('gallery.urls')),
    path('api/', include('testimonial.urls')),
    path('api/', include('inquiry.urls')),
    path('api/', include('Podcast.urls')),
    path('api/', include('blog.urls')),
    path('summernote/', include('django_summernote.urls')),
]


if hasattr(settings, "STORAGES") and settings.STORAGES["default"]["BACKEND"] == "people_first.storage.VercelBlobStorage":
    urlpatterns += [path("media/<path:name>", media_file)]
elif settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
