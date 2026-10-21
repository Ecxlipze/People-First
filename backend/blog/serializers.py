import re
from html import unescape as html_unescape

from django.conf import settings
from rest_framework import serializers

from .models import BlogCategory, BlogPost


def plain_text(text: str) -> str:
    # Block tags become spaces so a heading never runs into the paragraph after
    # it; inline tags (bold, links) vanish so "bold." keeps its full stop.
    text = re.sub(r"</?(?:p|h[1-6]|li|ul|ol|div|br|hr|blockquote|pre|tr|td|th|figure|figcaption)\b[^>]*>", " ", text or "")
    return " ".join(html_unescape(re.sub(r"<[^>]+>", "", text)).split())


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = "__all__"


class BlogPostListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True, default=None)
    category_slug = serializers.CharField(source="category.slug", read_only=True, default=None)
    reading_minutes = serializers.SerializerMethodField()
    is_mine = serializers.SerializerMethodField()
    editable = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        exclude = ["content", "author"]
        read_only_fields = ["view_count"]

    def _user(self):
        request = self.context.get("request")
        return getattr(request, "user", None)

    def get_is_mine(self, obj):
        user = self._user()
        return bool(user and user.is_authenticated and obj.author_id == user.id)

    def get_editable(self, obj):
        """Whether the CMS should offer to edit this post to the current user."""
        user = self._user()
        if not (user and user.is_authenticated):
            return False
        if user.is_staff:
            return True
        return obj.author_id == user.id and obj.status == BlogPost.Status.DRAFT

    def get_reading_minutes(self, obj):
        words = len(plain_text(obj.content).split())
        return max(1, round(words / 200))

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        raw = request is not None and request.query_params.get("raw")  # the CMS wants the stored value
        if not data.get("excerpt") and not raw:
            text = plain_text(instance.content)
            data["excerpt"] = text[:180].rsplit(" ", 1)[0] + "…" if len(text) > 180 else text
        return data


class BlogPostSerializer(BlogPostListSerializer):
    class Meta:
        model = BlogPost
        exclude = ["author"]
        read_only_fields = ["view_count"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        content = data.get("content") or ""
        if request is not None:
            # Editor-uploaded images are stored as site-relative /media/ paths,
            # but the Next.js site lives on another origin: make them absolute.
            origin = request.build_absolute_uri(settings.MEDIA_URL)
            content = content.replace(f'src="{settings.MEDIA_URL}', f'src="{origin}')
        data["content"] = re.sub(r"<img\b", '<img loading="lazy" decoding="async"', content)
        return data
