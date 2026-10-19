"""Reads a YouTube channel or playlist and returns plain dicts, one per video.

Two sources, same output shape:
  * YouTube Data API v3 (needs YOUTUBE_API_KEY): full history, durations.
  * Public RSS feed (no key): the 15 newest videos, no durations.
"""
import json
import logging
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

from .youtube import HEADERS, parse_iso_duration

logger = logging.getLogger(__name__)

API = "https://www.googleapis.com/youtube/v3"
NS = {
    "a": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
    "media": "http://search.yahoo.com/mrss/",
}
SHORT_SECONDS = 60


class YouTubeSyncError(Exception):
    pass


def _get(url: str, timeout: int = 15) -> bytes:
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read()
    except Exception as exc:  # network, HTTP error, timeout
        raise YouTubeSyncError(f"Request failed for {url.split('?')[0]}: {exc}") from exc


def _api(path: str, key: str, **params) -> dict:
    query = urllib.parse.urlencode({**params, "key": key})
    return json.loads(_get(f"{API}/{path}?{query}"))


def resolve_channel_id(handle: str) -> str:
    """Looks up a channel's UC… id from its @handle on the public channel page."""
    handle = handle.strip().lstrip("@")
    html = _get(f"https://www.youtube.com/@{urllib.parse.quote(handle)}").decode("utf-8", "ignore")
    match = re.search(r'<link rel="canonical" href="https://www\.youtube\.com/channel/(UC[\w-]{22})"', html) \
        or re.search(r'"channelId":"(UC[\w-]{22})"', html)
    if not match:
        raise YouTubeSyncError(f"Could not resolve a channel id for @{handle}; set YOUTUBE_CHANNEL_ID.")
    return match.group(1)


def _iso_seconds(iso: str) -> int:
    h, m, s = (int(x) if x else 0 for x in re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso or "").groups())
    return h * 3600 + m * 60 + s


def _parse_dt(value: str):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def _best_thumb(thumbs: dict) -> str:
    for size in ("maxres", "standard", "high", "medium", "default"):
        if size in thumbs:
            return thumbs[size]["url"]
    return ""


def fetch_via_api(key: str, playlist_id: str, limit: int | None) -> list[dict]:
    ids: list[str] = []
    token = None
    while limit is None or len(ids) < limit:
        data = _api("playlistItems", key, part="contentDetails", playlistId=playlist_id,
                    maxResults=50, **({"pageToken": token} if token else {}))
        ids += [i["contentDetails"]["videoId"] for i in data.get("items", [])]
        token = data.get("nextPageToken")
        if not token:
            break
    ids = ids[:limit] if limit else ids

    videos = []
    for i in range(0, len(ids), 50):
        data = _api("videos", key, part="snippet,contentDetails,status", id=",".join(ids[i:i + 50]))
        for item in data.get("items", []):
            if item.get("status", {}).get("privacyStatus") != "public":
                continue
            seconds = _iso_seconds(item["contentDetails"].get("duration", ""))
            if 0 < seconds <= SHORT_SECONDS:
                continue  # Shorts are not podcast episodes
            sn = item["snippet"]
            videos.append({
                "video_id": item["id"],
                "title": sn["title"],
                "description": sn.get("description", ""),
                "published_at": _parse_dt(sn["publishedAt"]),
                "thumbnail_url": _best_thumb(sn.get("thumbnails", {})),
                "duration": parse_iso_duration(item["contentDetails"].get("duration", "")),
                "author": sn.get("channelTitle", ""),
            })
    return videos


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def is_short(video_id: str) -> bool:
    """True if /shorts/<id> serves the video itself (200); a full video redirects (303).

    The RSS feed carries no duration and links Shorts as ordinary watch URLs, so
    this is the only keyless signal. Network trouble counts as "not a Short".
    """
    req = urllib.request.Request(f"https://www.youtube.com/shorts/{video_id}", headers=HEADERS, method="HEAD")
    try:
        with urllib.request.build_opener(_NoRedirect).open(req, timeout=10) as resp:
            return resp.status == 200
    except Exception:
        return False


def fetch_via_rss(channel_id: str, playlist_id: str) -> list[dict]:
    param = f"playlist_id={playlist_id}" if playlist_id else f"channel_id={channel_id}"
    root = ET.fromstring(_get(f"https://www.youtube.com/feeds/videos.xml?{param}"))
    videos = []
    for entry in root.findall("a:entry", NS):
        link = entry.find("a:link", NS)
        video_id = entry.findtext("yt:videoId", namespaces=NS)
        if (link is not None and "/shorts/" in link.get("href", "")) or is_short(video_id):
            continue
        group = entry.find("media:group", NS)
        thumb = group.find("media:thumbnail", NS) if group is not None else None
        desc = group.find("media:description", NS) if group is not None else None
        videos.append({
            "video_id": video_id,
            "title": entry.findtext("a:title", namespaces=NS) or "",
            "description": (desc.text or "") if desc is not None else "",
            "published_at": _parse_dt(entry.findtext("a:published", namespaces=NS)),
            "thumbnail_url": thumb.get("url") if thumb is not None else "",
            "duration": "",
            "author": entry.findtext("a:author/a:name", namespaces=NS) or "",
        })
    return videos


def fetch_videos(*, api_key="", channel_id="", handle="", playlist_id="", limit=None) -> list[dict]:
    """Newest-first list of public videos from the playlist if given, else the channel's uploads."""
    if not playlist_id and not channel_id:
        if not handle:
            raise YouTubeSyncError("Set YOUTUBE_PLAYLIST_ID, YOUTUBE_CHANNEL_ID or YOUTUBE_CHANNEL_HANDLE.")
        channel_id = resolve_channel_id(handle)
    if api_key:
        # A channel's uploads playlist id is its channel id with UC → UU.
        return fetch_via_api(api_key, playlist_id or "UU" + channel_id[2:], limit)
    videos = fetch_via_rss(channel_id, playlist_id)
    return videos[:limit] if limit else videos
