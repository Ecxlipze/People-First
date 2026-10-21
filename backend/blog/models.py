import nh3
from django.conf import settings
from django.db import models
from django.utils import timezone

# What a post body may contain. Everything else (scripts, iframes, event
# handlers, javascript: URLs) is stripped on save, so the frontend can render the
# stored HTML as-is.
ALLOWED_TAGS = {
    "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "blockquote", "pre", "code",
    "strong", "b", "em", "i", "u", "s", "strike", "sub", "sup", "span", "div",
    "ul", "ol", "li", "a", "img", "figure", "figcaption",
    "table", "thead", "tbody", "tr", "th", "td",
}
ALLOWED_ATTRIBUTES = {
    "a": {"href", "title", "target"},
    "img": {"src", "alt", "title", "width", "height"},
    "*": {"style"},
    "th": {"colspan", "rowspan"},
    "td": {"colspan", "rowspan"},
}
ALLOWED_STYLE_PROPERTIES = {"text-align", "color", "background-color", "font-weight", "font-style", "text-decoration"}


def clean_html(html: str) -> str:
    return nh3.clean(
        html or "",
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        filter_style_properties=ALLOWED_STYLE_PROPERTIES,
        link_rel="noopener noreferrer",
        url_schemes={"http", "https", "mailto", "tel"},
    )


class BlogCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["display_order", "name"]
        verbose_name_plural = "blog categories"

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    title = models.CharField(max_length=255)
    slug = models.SlugField(
        max_length=255, unique=True,
        help_text="The post's URL: /blog/<slug>. Changing it later breaks existing links.",
    )
    category = models.ForeignKey(
        BlogCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="posts",
    )
    excerpt = models.TextField(
        blank=True, help_text="Short summary shown on the blog listing. Falls back to the start of the post.",
    )
    content = models.TextField(blank=True)
    featured_image = models.ImageField(upload_to="blog/featured/", null=True, blank=True)
    featured_image_alt = models.CharField(max_length=255, blank=True)
    author_name = models.CharField(max_length=120, blank=True)
    # The account that wrote the post. Only set for posts written by a "Blog
    # Authors" user, who may edit their own drafts and nothing else.
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="blog_posts", editable=True,
    )

    # Optional extras for the Media / Events feature layout (the red headline
    # metric, the teal stat card, a wider editorial image, a video link). Blank
    # on an ordinary article; the page simply omits what is blank.
    metric = models.CharField(max_length=100, blank=True)
    metric_label = models.CharField(max_length=255, blank=True)
    card_value = models.CharField(max_length=100, blank=True)
    card_label = models.CharField(max_length=255, blank=True)
    studio_image = models.ImageField(upload_to="blog/studio/", null=True, blank=True)
    studio_image_alt = models.CharField(max_length=255, blank=True)
    video_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(
        default=0, help_text="Lower numbers come first on Media / Events; ties go newest first.",
    )

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    published_at = models.DateTimeField(
        null=True, blank=True,
        help_text="Set automatically when first published. A future date schedules the post.",
    )

    meta_title = models.CharField(
        max_length=70, blank=True, help_text="Search-result title. Defaults to the post title.",
    )
    meta_description = models.CharField(
        max_length=160, blank=True, help_text="Search-result description. Defaults to the excerpt.",
    )

    # Incremented by POST /api/blog-posts/<slug>/view/ (see BlogPostViewSet.view).
    view_count = models.PositiveBigIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-published_at", "-created_at"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.content = clean_html(self.content)
        if self.status == self.Status.PUBLISHED and self.published_at is None:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)
