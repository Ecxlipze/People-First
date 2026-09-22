from django import forms
from django.contrib import admin
from django.core.files.base import ContentFile
from django.http import JsonResponse
from django.urls import path
from django.utils.html import format_html
from django.utils.text import slugify

from .models import Podcast
from .youtube import download_youtube_thumbnail, fetch_youtube_metadata


class ColorInputWidget(forms.TextInput):
    """Renders a text field alongside a native HTML5 color picker and a clear button."""
    def render(self, name, value, attrs=None, renderer=None):
        text_html = super().render(name, value, attrs=attrs, renderer=renderer)
        color_val = value if value and str(value).startswith("#") and len(str(value)) == 7 else "#2dbe9e"
        input_id = attrs.get("id", f"id_{name}") if attrs else f"id_{name}"
        picker_html = format_html(
            '<input type="color" value="{}" style="vertical-align: middle; margin-left: 8px; height: 32px; width: 38px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; padding: 2px;" '
            'oninput="document.getElementById(\'{}\').value = this.value;" title="Pick color">'
            '<button type="button" style="margin-left: 8px; vertical-align: middle; padding: 4px 8px; font-size: 11px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: #f8f9fa;" '
            'onclick="document.getElementById(\'{}\').value = \'\';" title="Reset to site default palette">Clear (Default)</button>',
            color_val,
            input_id,
            input_id,
        )
        return format_html('{}{}', text_html, picker_html)


class YouTubeUrlWidget(forms.URLInput):
    """
    Renders the YouTube video URL input alongside an instant '⚡ Fetch from YouTube' button,
    a status indicator, and an automatic thumbnail preview.
    """
    def render(self, name, value, attrs=None, renderer=None):
        base_html = super().render(name, value, attrs=attrs, renderer=renderer)
        input_id = attrs.get("id", f"id_{name}") if attrs else f"id_{name}"
        extra_html = format_html(
            '''
            <button type="button" id="btn_fetch_youtube" style="
                margin-left: 8px;
                vertical-align: middle;
                padding: 6px 14px;
                font-size: 12px;
                font-weight: 600;
                color: #fff;
                background: #a02f52;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.2s;
            " onmouseover="this.style.background='#8c2946'" onmouseout="this.style.background='#a02f52'">
                ⚡ Fetch from YouTube
            </button>
            <span id="yt_fetch_status" style="margin-left: 10px; font-size: 12px; vertical-align: middle;"></span>
            <input type="hidden" name="fetched_thumbnail_url" id="id_fetched_thumbnail_url" value="">

            <div id="yt_preview_container" style="display: none; margin-top: 12px; padding: 12px; background: #f8f9fa; border: 1px solid #e2e8f0; border-radius: 6px; max-width: 480px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #475569;">
                    ✓ YouTube Thumbnail Preview (will be saved to media storage on Save):
                </p>
                <img id="yt_preview_img" src="" alt="Thumbnail preview" style="max-width: 100%; height: auto; border-radius: 4px; border: 1px solid #cbd5e1;" />
            </div>

            <script>
            (function() {{
                function initYouTubeFetch() {{
                    const btn = document.getElementById('btn_fetch_youtube');
                    const urlInput = document.getElementById('{0}');
                    const statusSpan = document.getElementById('yt_fetch_status');
                    const previewContainer = document.getElementById('yt_preview_container');
                    const previewImg = document.getElementById('yt_preview_img');
                    const titleInput = document.getElementById('id_title');
                    const descInput = document.getElementById('id_description');
                    const fetchedThumbInput = document.getElementById('id_fetched_thumbnail_url');

                    if (!btn || !urlInput) return;

                    async function doFetch() {{
                        const url = urlInput.value.trim();
                        if (!url) {{
                            statusSpan.textContent = 'Please enter a YouTube URL first.';
                            statusSpan.style.color = '#dc2626';
                            return;
                        }}

                        btn.disabled = true;
                        btn.textContent = '⏳ Fetching...';
                        statusSpan.textContent = 'Extracting metadata from YouTube...';
                        statusSpan.style.color = '#475569';

                        try {{
                            const fetchUrl = '/admin/Podcast/podcast/fetch-youtube/?url=' + encodeURIComponent(url);
                            const res = await fetch(fetchUrl);
                            const data = await res.json();

                            if (data.success) {{
                                if (titleInput) {{
                                    titleInput.value = data.title;
                                    titleInput.dispatchEvent(new Event('input', {{ bubbles: true }}));
                                    titleInput.dispatchEvent(new Event('change', {{ bubbles: true }}));
                                    titleInput.dispatchEvent(new Event('keyup', {{ bubbles: true }}));
                                }}
                                if (descInput && (!descInput.value.trim() || descInput.value.length < 20)) {{
                                    if (data.description) {{
                                        descInput.value = data.description;
                                    }}
                                }}
                                if (data.thumbnail_url) {{
                                    if (fetchedThumbInput) {{
                                        fetchedThumbInput.value = data.thumbnail_url;
                                    }}
                                    if (previewImg && previewContainer) {{
                                        previewImg.src = data.thumbnail_url;
                                        previewContainer.style.display = 'block';
                                    }}
                                }}

                                // Auto-fill Highlights / Video Metrics (Duration & Release Date)
                                const metricValInput = document.getElementById('id_metric_value');
                                const metricLabelInput = document.getElementById('id_metric_label');
                                const suppTitleInput = document.getElementById('id_supporting_title');
                                const suppContentInput = document.getElementById('id_supporting_content');

                                if (data.duration && metricValInput && (!metricValInput.value.trim() || metricValInput.dataset.autofilled === 'true')) {{
                                    metricValInput.value = data.duration;
                                    metricValInput.dataset.autofilled = 'true';
                                    if (metricLabelInput && (!metricLabelInput.value.trim() || metricLabelInput.dataset.autofilled === 'true')) {{
                                        metricLabelInput.value = 'Episode Duration';
                                        metricLabelInput.dataset.autofilled = 'true';
                                    }}
                                }}

                                if (data.release_date && suppTitleInput && (!suppTitleInput.value.trim() || suppTitleInput.dataset.autofilled === 'true')) {{
                                    suppTitleInput.value = data.release_date;
                                    suppTitleInput.dataset.autofilled = 'true';
                                    if (suppContentInput && (!suppContentInput.value.trim() || suppContentInput.dataset.autofilled === 'true')) {{
                                        suppContentInput.value = data.author ? ('Published by ' + data.author) : 'Published';
                                        suppContentInput.dataset.autofilled = 'true';
                                    }}
                                }}

                                statusSpan.textContent = '✓ Successfully extracted! Title, Description, Duration, Date & Thumbnail loaded.';
                                statusSpan.style.color = '#16a34a';
                            }} else {{
                                statusSpan.textContent = '✕ ' + (data.error || 'Failed to fetch YouTube details.');
                                statusSpan.style.color = '#dc2626';
                            }}
                        }} catch (err) {{
                            statusSpan.textContent = '✕ Network error while contacting server.';
                            statusSpan.style.color = '#dc2626';
                        }} finally {{
                            btn.disabled = false;
                            btn.textContent = '⚡ Fetch from YouTube';
                        }}
                    }}

                    btn.addEventListener('click', doFetch);
                    urlInput.addEventListener('blur', function() {{
                        if (urlInput.value.trim() && titleInput && !titleInput.value.trim()) {{
                            doFetch();
                        }}
                    }});
                }}

                if (document.readyState === 'loading') {{
                    document.addEventListener('DOMContentLoaded', initYouTubeFetch);
                }} else {{
                    initYouTubeFetch();
                }}
            }})();
            </script>
            ''',
            input_id,
        )
        return format_html('{}{}', base_html, extra_html)


class PodcastAdminForm(forms.ModelForm):
    class Meta:
        model = Podcast
        fields = "__all__"
        widgets = {
            "video_url": YouTubeUrlWidget(attrs={"placeholder": "https://www.youtube.com/watch?v=...", "style": "width: 420px;"}),
            "badge_colour": ColorInputWidget(attrs={"placeholder": "#2dbe9e", "style": "width: 100px;"}),
        }
        labels = {
            "description": "Episode Summary / Show Notes",
            "metric_value": "Highlight 1 Heading",
            "metric_label": "Highlight 1 Content",
            "supporting_title": "Highlight 2 Heading",
            "supporting_content": "Highlight 2 Content",
        }
        help_texts = {
            "video_url": "Paste a YouTube link and click '⚡ Fetch from YouTube' (or click away) to auto-fill Title, Description, and Thumbnail.",
            "description": "Full episode summary or show notes. Displayed on the card if highlights/stats below are left blank.",
            "metric_value": "Short heading (e.g. '50+ Clients', 'Guest', or 'Key Topic'). Optional.",
            "metric_label": "Details or description for Highlight 1. Optional.",
            "supporting_title": "Second short heading (e.g. 'Concept', 'Key Takeaway', or 'Outcome'). Optional.",
            "supporting_content": "Details or description for Highlight 2. Optional.",
        }


@admin.register(Podcast)
class PodcastAdmin(admin.ModelAdmin):
    form = PodcastAdminForm
    list_display = ("title", "badge", "is_featured", "metric_value", "metric_label", "supporting_title", "order", "is_active", "created_at")
    search_fields = ("title", "description", "badge", "metric_label", "supporting_title", "supporting_content")
    list_filter = ("is_featured", "is_active", "created_at")
    list_editable = ("is_featured", "order", "is_active")
    ordering = ("order", "-created_at")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("Episode Information", {
            "fields": ("title", "slug", "description"),
            "description": "Basic details and summary. If you leave the highlights below blank, the summary is shown on the card.",
        }),
        ("Media & Visuals", {
            "fields": ("thumbnail", "video_url", "badge", "badge_colour"),
            "description": "Upload a thumbnail image, specify an optional video URL, and customize the thumbnail badge.",
        }),
        ("Highlight / Key Takeaway 1 (Optional)", {
            "fields": ("metric_value", "metric_label"),
            "description": "Optional headline and text (e.g. '50+ Clients', 'Guest: John Doe', or 'Main Topic'). Leave blank if not needed.",
        }),
        ("Highlight / Key Takeaway 2 (Optional)", {
            "fields": ("supporting_title", "supporting_content"),
            "description": "Optional second headline and text (e.g. 'Concept', 'Key Takeaway', or 'Outcome'). Leave blank if not needed.",
        }),
        ("Publishing & Visibility", {
            "fields": ("order", "is_featured", "is_active"),
            "description": "Control display order, pin to /insights featured section, or toggle public visibility.",
        }),
        ("System Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "fetch-youtube/",
                self.admin_site.admin_view(self.fetch_youtube_view),
                name="Podcast_podcast_fetch_youtube",
            ),
        ]
        return custom_urls + urls

    def fetch_youtube_view(self, request):
        if not request.user.is_staff:
            return JsonResponse({"success": False, "error": "Unauthorized"}, status=403)
        url = request.GET.get("url", "").strip()
        if not url:
            return JsonResponse({"success": False, "error": "No URL provided."})
        data = fetch_youtube_metadata(url)
        return JsonResponse(data)

    def save_model(self, request, obj, form, change):
        # If user did not manually upload a thumbnail file in this request
        if not request.FILES.get("thumbnail"):
            fetched_thumb = request.POST.get("fetched_thumbnail_url", "").strip()
            if fetched_thumb:
                img_data = download_youtube_thumbnail(fetched_thumb)
                if img_data:
                    fname = f"{obj.slug or slugify(obj.title) or 'podcast'}-thumb.jpg"
                    obj.thumbnail.save(fname, ContentFile(img_data), save=False)
        super().save_model(request, obj, form, change)