from datetime import datetime
import html
import json
import logging
import re
import urllib.error
import urllib.request

logger = logging.getLogger(__name__)

# Matches standard YouTube URLs, short links, embeds, and shorts
YOUTUBE_REGEX = re.compile(
    r'(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})'
)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}


def extract_youtube_id(url: str) -> str | None:
    """Extracts the 11-character YouTube video ID from various YouTube URL formats."""
    if not url:
        return None
    match = YOUTUBE_REGEX.search(url.strip())
    return match.group(1) if match else None


def parse_iso_duration(iso_str: str) -> str:
    """Converts ISO 8601 duration (e.g. PT45M12S, PT1H15M) into human readable format (e.g. 45 min, 1h 15m)."""
    if not iso_str or not iso_str.startswith('PT'):
        return ''
    hours = re.search(r'(\d+)H', iso_str)
    minutes = re.search(r'(\d+)M', iso_str)
    seconds = re.search(r'(\d+)S', iso_str)

    h = int(hours.group(1)) if hours else 0
    m = int(minutes.group(1)) if minutes else 0
    s = int(seconds.group(1)) if seconds else 0

    if h > 0:
        return f'{h}h {m}m' if m > 0 else f'{h} hr'
    elif m > 0:
        return f'{m} min'
    elif s > 0:
        return f'{s} sec'
    return ''


def parse_iso_date(date_str: str) -> str:
    """Converts ISO date (e.g. 2024-10-24T23:57:33) into readable month/year (e.g. Oct 2024)."""
    if not date_str:
        return ''
    try:
        clean_date = date_str.split('T')[0]
        dt = datetime.strptime(clean_date, '%Y-%m-%d')
        return dt.strftime('%b %Y')
    except Exception:
        return ''


def fetch_youtube_metadata(url: str) -> dict:
    """
    Fetches title, author, description, high-res thumbnail, duration, and release date for a given YouTube URL.
    Does not require an API key.
    """
    video_id = extract_youtube_id(url)
    if not video_id:
        return {'success': False, 'error': 'Please provide a valid YouTube video URL.'}

    # 1. Fetch title and author via official oEmbed endpoint (fast & reliable)
    oembed_url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json'
    title = ''
    author = ''
    try:
        req = urllib.request.Request(oembed_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            title = data.get('title', '')
            author = data.get('author_name', '')
    except Exception as e:
        logger.warning('Failed to fetch oEmbed data for video %s: %s', video_id, e)

    # 2. Check for max-res thumbnail; fall back to HQ thumbnail
    maxres_url = f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg'
    hq_url = f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg'
    thumbnail_url = hq_url

    try:
        head_req = urllib.request.Request(maxres_url, headers=HEADERS, method='HEAD')
        with urllib.request.urlopen(head_req, timeout=3) as resp:
            if resp.status == 200:
                thumbnail_url = maxres_url
    except Exception:
        # maxresdefault is not available for all videos; hqdefault is guaranteed
        thumbnail_url = hq_url

    # 3. Attempt to extract video description, duration, and publish date from meta tags
    description = ''
    duration = ''
    release_date = ''
    watch_url = f'https://www.youtube.com/watch?v={video_id}'
    try:
        page_req = urllib.request.Request(watch_url, headers=HEADERS)
        with urllib.request.urlopen(page_req, timeout=3) as resp:
            page_html = resp.read().decode('utf-8', errors='ignore')

            # Description
            desc_match = re.search(
                r'<meta\s+(?:property="og:description"|name="description")\s+content="([^"]*)"',
                page_html,
            )
            if desc_match:
                description = html.unescape(desc_match.group(1).strip())

            # Duration
            dur_match = re.search(
                r'<meta\s+itemprop="duration"\s+content="([^"]*)"',
                page_html,
            )
            if dur_match:
                duration = parse_iso_duration(dur_match.group(1).strip())

            # Publish Date
            date_match = re.search(
                r'<meta\s+itemprop="datePublished"\s+content="([^"]*)"',
                page_html,
            )
            if date_match:
                release_date = parse_iso_date(date_match.group(1).strip())

            # Fallback author if oEmbed did not provide it
            if not author:
                author_match = re.search(r'"ownerChannelName":"([^"]*)"', page_html)
                if author_match:
                    author = author_match.group(1).strip()
    except Exception as e:
        logger.debug('Failed to extract extra page metadata for video %s: %s', video_id, e)

    return {
        'success': True,
        'video_id': video_id,
        'title': title,
        'author': author,
        'description': description,
        'thumbnail_url': thumbnail_url,
        'duration': duration,
        'release_date': release_date,
    }


def download_youtube_thumbnail(thumbnail_url: str) -> bytes | None:
    """Downloads thumbnail image bytes from YouTube."""
    if not thumbnail_url:
        return None
    try:
        req = urllib.request.Request(thumbnail_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=8) as resp:
            if resp.status == 200:
                return resp.read()
    except Exception as e:
        logger.error('Failed to download YouTube thumbnail from %s: %s', thumbnail_url, e)
    return None
