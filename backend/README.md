# People First Backend API Documentation

Frontend integration guide for the People First Django REST API.

---

## 1. Base URL

### Local Development

```text
http://127.0.0.1:8000/api/
```

Example:

```text
http://127.0.0.1:8000/api/blog-posts/
```

> Replace the base URL with the production API URL when the backend is deployed.

---

# 2. Authentication

The API uses JWT authentication for protected operations.

For authenticated requests, send:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Public read requests are available without authentication for the content APIs.

Admin create, update, and delete operations require an authenticated staff/admin user.

### Important: Inquiry

The inquiry create endpoint is public:

```http
POST /api/inquiries/
```

The other inquiry operations are admin-only.

---

# 3. API Endpoint Summary

| Feature | Method | Endpoint | Access |
|---|---|---|---|
| Featured Work | GET | `/api/featured-work/` | Public |
| Featured Work Detail | GET | `/api/featured-work/{id}/` | Public |
| Featured Work | POST | `/api/featured-work/` | Admin |
| Featured Work | PUT | `/api/featured-work/{id}/` | Admin |
| Featured Work | PATCH | `/api/featured-work/{id}/` | Admin |
| Featured Work | DELETE | `/api/featured-work/{id}/` | Admin |
| Gallery | GET | `/api/gallery/` | Public |
| Gallery Detail | GET | `/api/gallery/{id}/` | Public |
| Gallery | POST | `/api/gallery/` | Admin |
| Gallery | PUT | `/api/gallery/{id}/` | Admin |
| Gallery | PATCH | `/api/gallery/{id}/` | Admin |
| Gallery | DELETE | `/api/gallery/{id}/` | Admin |
| Testimonials | GET | `/api/testimonials/` | Public |
| Testimonials Detail | GET | `/api/testimonials/{id}/` | Public |
| Testimonials | POST | `/api/testimonials/` | Admin |
| Testimonials | PUT | `/api/testimonials/{id}/` | Admin |
| Testimonials | PATCH | `/api/testimonials/{id}/` | Admin |
| Testimonials | DELETE | `/api/testimonials/{id}/` | Admin |
| Podcasts | GET | `/api/podcasts/` | Public |
| Podcast Detail | GET | `/api/podcasts/{id}/` | Public |
| Latest Podcast | GET | `/api/podcasts/latest/` | Public |
| Podcasts | POST | `/api/podcasts/` | Admin |
| Podcasts | PUT | `/api/podcasts/{id}/` | Admin |
| Podcasts | PATCH | `/api/podcasts/{id}/` | Admin |
| Podcasts | DELETE | `/api/podcasts/{id}/` | Admin |
| Blog post view | POST | `/api/blog-posts/{slug}/view/` | Public |
| Blog posts | POST | `/api/blog-posts/` | Admin, or Blog Author (saved as own draft) |
| Blog post | PUT/PATCH | `/api/blog-posts/{slug}/` | Admin, or Blog Author on their own drafts only |
| Blog post | DELETE | `/api/blog-posts/{slug}/` | Admin |
| Inquiries | POST | `/api/inquiries/` | Public |
| Inquiries | GET | `/api/inquiries/` | Admin |
| Inquiry Detail | GET | `/api/inquiries/{id}/` | Admin |
| Inquiries | PUT | `/api/inquiries/{id}/` | Admin |
| Inquiries | PATCH | `/api/inquiries/{id}/` | Admin |
| Inquiries | DELETE | `/api/inquiries/{id}/` | Admin |

## Blog Authors role (CMS)

A restricted CMS account for writers. In the Django admin create a user, leave
**Staff status off**, keep **Active** on, and add them to the **Blog Authors**
group (created by migration `blog.0006`). They can sign in to `/cms`, where they
see only Blog posts. Over the API they may:

- read published posts plus their own drafts (never anyone else's drafts);
- create posts, always saved as `draft`, with `author` set to them and
  `author_name` forced to their full name (or username);
- edit only their own posts while they are still drafts (once an admin
  publishes one it is read-only to them); `status`, `published_at`, `order` and
  `author_name` are ignored if sent;
- upload inline images (`/api/blog-uploads/`).

They cannot delete, publish, create categories, or use any other endpoint.
`GET /api/blog-session/` returns `{username, display_name, role}`; posts carry
read-only `is_mine` and `editable` flags. `GET/PATCH /api/profile/` (first name,
last name, email) and `POST /api/profile/password/` (`current_password`,
`new_password`, validated and throttled to 10/min) let any CMS user manage
their own account. Admins assign `author` on a post in
the Django admin.

---

# 4. Featured Work API

## Endpoints

```http
GET    /api/featured-work/
GET    /api/featured-work/{id}/
POST   /api/featured-work/
PUT    /api/featured-work/{id}/
PATCH  /api/featured-work/{id}/
DELETE /api/featured-work/{id}/
```

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Featured work title |
| `description` | string | Yes | Main description |
| `thumbnail` | image | No | Preview/thumbnail image |
| `video_url` | URL | No | External video URL |
| `metric_value` | string | No | Main metric value, e.g. `94%` |
| `metric_label` | string | No | Main metric label |
| `secondary_metric_value` | string | No | Secondary metric value |
| `secondary_metric_label` | string | No | Secondary metric label |
| `bullets` | array | No | List of bullet points |
| `order` | integer | No | Display order |

## JSON Example

```json
{
  "title": "AI-Powered Security System",
  "description": "A real-time AI solution for security monitoring.",
  "video_url": "https://www.youtube.com/watch?v=XXXXXXXX",
  "metric_value": "94%",
  "metric_label": "Detection Accuracy",
  "secondary_metric_value": "95%",
  "secondary_metric_label": "Face Recognition",
  "bullets": [
    "Real-time monitoring",
    "AI-based detection",
    "Instant alerts"
  ],
  "order": 1
}
```

For `thumbnail`, use `multipart/form-data`.

---

# 6. Gallery API

## Endpoints

```http
GET    /api/gallery/
GET    /api/gallery/{id}/
POST   /api/gallery/
PUT    /api/gallery/{id}/
PATCH  /api/gallery/{id}/
DELETE /api/gallery/{id}/
```

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `image` | image | Yes | Gallery image |
| `title` | string | No | Image title |
| `caption` | string | No | Caption |
| `alt_text` | string | No | Accessibility text |
| `display_order` | integer | No | Display order |
| `is_active` | boolean | No | Whether the image is active |

For `image` upload, use `multipart/form-data`.

---

# 7. Testimonials API

## Endpoints

```http
GET    /api/testimonials/
GET    /api/testimonials/{id}/
POST   /api/testimonials/
PUT    /api/testimonials/{id}/
PATCH  /api/testimonials/{id}/
DELETE /api/testimonials/{id}/
```

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Person's name |
| `avatar` | image | No | Person's avatar |
| `handle` | string | No | Social handle or role text |
| `body` | string | Yes | Testimonial text |
| `tags` | array | No | List of tags |
| `display_order` | integer | No | Display order |
| `is_active` | boolean | No | Whether testimonial is active |

## JSON Example

```json
{
  "name": "Darrell Steward",
  "handle": "@darrels",
  "body": "You made it so simple. My new site is so much faster and easier to work with than my old site.",
  "tags": [
    "another"
  ],
  "display_order": 1,
  "is_active": true
}
```

For `avatar`, use `multipart/form-data`.

If the backend serializer exposes `hasAvatar`, it is generated from the `avatar` field and should not be submitted from the frontend.

---

# 8. Insight Categories API (retired)

> **Retired.** Insights are now blog posts (see section 11). These endpoints are no longer routed; the section is kept for reference.

## Endpoints

```http
GET    /api/insight-categories/
GET    /api/insight-categories/{id}/
POST   /api/insight-categories/
PUT    /api/insight-categories/{id}/
PATCH  /api/insight-categories/{id}/
DELETE /api/insight-categories/{id}/
```

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Category name |
| `slug` | string | Yes | URL-friendly unique slug |
| `display_order` | integer | No | Display order |
| `is_active` | boolean | No | Whether category is active |

## JSON Example

```json
{
  "name": "Digital Commerce",
  "slug": "digital-commerce",
  "display_order": 1,
  "is_active": true
}
```

---

# 9. Insights API (retired)

> **Retired.** Insights are now blog posts (see section 11). These endpoints are no longer routed; the section is kept for reference.

## Endpoints

```http
GET    /api/insights/
GET    /api/insights/{id}/
POST   /api/insights/
PUT    /api/insights/{id}/
PATCH  /api/insights/{id}/
DELETE /api/insights/{id}/
```

## Category Filter

### All Insights

```http
GET /api/insights/
```

### Insights by Category

```http
GET /api/insights/?category=ai
```

or:

```http
GET /api/insights/?category=digital-commerce
```

The value after `category=` must match the `slug` of an `InsightCategory`.

Example:

```text
InsightCategory
name: Digital Commerce
slug: digital-commerce
```

Request:

```http
GET /api/insights/?category=digital-commerce
```

If no `category` query parameter is provided, all insights are returned.

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `category` | integer | No | ID of the InsightCategory |
| `title` | string | Yes | Insight title |
| `slug` | string | Yes | URL-friendly unique slug |
| `summary` | string | Yes | Short description for cards/listing |
| `content` | string | Yes | Full detailed article content |
| `metric` | string | No | Metric value, e.g. `80%` |
| `metric_label` | string | No | Metric label |
| `card_value` | string | No | Card value, e.g. `2025` |
| `card_label` | string | No | Card label |
| `thumbnail` | image | No | Main insight thumbnail |
| `thumbnail_alt` | string | No | Main thumbnail alt text |
| `studio_thumbnail` | image | No | Studio/secondary thumbnail |
| `studio_thumbnail_alt` | string | No | Studio thumbnail alt text |
| `video_url` | URL | No | External video URL |
| `featured` | boolean | No | Featured flag |
| `recommended` | boolean | No | Recommended flag |
| `order` | integer | No | Display order |
| `publish_status` | string | No | `draft` or `published` |

## JSON Example

```json
{
  "category": 1,
  "title": "Reasons Pakistani Manufacturers Should Start Selling Online",
  "slug": "reasons-pakistani-manufacturers-should-start-selling-online",
  "summary": "The strategy is the key to grow your business through online marketing",
  "content": "Full detailed article content goes here.",
  "metric": "80%",
  "metric_label": "Beneficial Marketing tips",
  "card_value": "2025",
  "card_label": "MARKETING TIPS",
  "video_url": "https://www.youtube.com/watch?v=XXXXXXXX",
  "featured": true,
  "recommended": false,
  "order": 1,
  "publish_status": "published"
}
```

For `thumbnail` and `studio_thumbnail`, use `multipart/form-data`.

### Publish Status

Allowed values:

```text
draft
published
```

---

# 10. Podcasts API

## View and subscriber counts

- `Podcast.view_count` is YouTube's view count for the episode. The sync
  (`sync_youtube_podcasts`, and the hourly auto-sync on `GET /api/podcasts/`)
  refreshes it. It comes from the channel RSS feed, which carries counts for the
  15 newest videos only (older episodes keep their last value); if
  `YOUTUBE_API_KEY` happens to be set, the API path covers every video.
  Read-only in the API.
- `BlogPost.view_count` is incremented by `POST /api/blog-posts/{slug}/view/`
  (public, atomic, 404 for drafts and scheduled posts). The site calls it once
  per reader per post per 24 hours. It is an unauthenticated counter, so treat
  it as a popularity signal, not an audited metric. Read-only in the API.

## Endpoints

```http
GET    /api/podcasts/
GET    /api/podcasts/{id}/
POST   /api/podcasts/
PUT    /api/podcasts/{id}/
PATCH  /api/podcasts/{id}/
DELETE /api/podcasts/{id}/
```

## Latest Podcast

```http
GET /api/podcasts/latest/
```

The latest endpoint returns the most recently created active podcast based on `created_at`.

## YouTube Metadata Auto-Extraction

When creating or editing a podcast in Django Admin:
- Pasting a YouTube URL (`video_url`) and clicking **"⚡ Fetch from YouTube"** (or clicking away) automatically queries YouTube's oEmbed and OpenGraph metadata to populate:
  - **Title** (and automatically updates the **Slug**)
  - **Description** (if empty)
  - **Thumbnail** (high-resolution thumbnail preview and download)
- When saved, the highest resolution thumbnail (`maxresdefault.jpg` or `hqdefault.jpg`) is automatically downloaded and saved to Django's local media storage (`media/podcasts/thumbnails/`).
- If a podcast is saved programmatically with a `video_url` but no `thumbnail`, `Podcast.save()` will automatically download and attach the thumbnail as a background fallback.

## Automatic YouTube Sync

`python manage.py sync_youtube_podcasts` creates an episode for every new video on the
YouTube channel (or designated playlist). It is idempotent, keyed on `youtube_video_id`;
hand-made episodes with the same video URL are adopted, not duplicated, and existing
episodes keep their edited copy unless `--refresh` is passed. Shorts and non-public
videos are skipped. Options: `--limit N`, `--refresh`, `--dry-run`.

Configuration (`backend/.env`, see `.env.example`):

| Variable | Effect |
|---|---|
| `YOUTUBE_PLAYLIST_ID` | If set, only this playlist is synced (a designated podcast playlist). |
| `YOUTUBE_CHANNEL_ID` / `YOUTUBE_CHANNEL_HANDLE` | Otherwise all channel uploads are synced. The handle is resolved to an id on each run. |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key: full history plus episode durations. Without it the public RSS feed is used (newest 15 videos, no durations). |

To publish new episodes automatically, schedule the command, e.g. hourly:

```cron
0 * * * * cd /path/to/backend && venv/bin/python manage.py sync_youtube_podcasts
```

The frontend refreshes its cached `/api/podcasts/` data on its own revalidation timer,
so a new episode appears on `/podcasts` shortly after the next sync.

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `youtube_video_id` | string | No | Set by the sync; unique |
| `published_at` | datetime | No | YouTube publish time; episodes sort newest first within the same `order` |
| `title` | string | Yes | Podcast title |
| `slug` | string | Yes | URL-friendly unique slug |
| `description` | string | Yes | Podcast description |
| `thumbnail` | image | No | Podcast thumbnail |
| `video_url` | URL | No | External video URL |
| `metric_value` | string | No | Metric value, e.g. `50+ clients` |
| `metric_label` | string | No | Metric label / body |
| `badge` | string | No | Coloured pill text on the thumbnail |
| `badge_colour` | string | No | Hex colour for badge, e.g. `#2dbe9e` |
| `supporting_title` | string | No | Supporting section title, e.g. `Concept` |
| `supporting_content` | string | No | Supporting section text |
| `order` | integer | No | Display order |
| `is_featured` | boolean | No | Pin this episode to the featured section on `/insights` (up to 3) |
| `is_active` | boolean | No | Whether podcast is active |

## JSON Example

```json
{
  "title": "Future of Artificial Intelligence",
  "slug": "future-of-artificial-intelligence",
  "description": "A discussion about the future of AI and emerging technologies.",
  "video_url": "https://www.youtube.com/watch?v=XXXXXXXX",
  "badge": "Largest digital marketing conference",
  "badge_colour": "#2dbe9e",
  "metric_value": "50+ clients",
  "metric_label": "Search Digital Agency New York...",
  "supporting_title": "Concept",
  "supporting_content": "For more than 50 years, global stage for innovation.",
  "order": 1,
  "is_featured": true,
  "is_active": true
}
```

For `thumbnail`, use `multipart/form-data`.

### Video Handling

Videos are not uploaded to the backend in the current model. Store the external video link in `video_url`.

Examples:

```text
https://www.youtube.com/watch?v=XXXXXXXX
```

```text
https://vimeo.com/XXXXXXXX
```

---

# 11. Inquiry API

The Inquiry API uses one form with four possible inquiry types.

## Endpoints

```http
POST   /api/inquiries/
GET    /api/inquiries/
GET    /api/inquiries/{id}/
PUT    /api/inquiries/{id}/
PATCH  /api/inquiries/{id}/
DELETE /api/inquiries/{id}/
```

## Access

### Public

```http
POST /api/inquiries/
```

### Admin Only

```http
GET /api/inquiries/
GET /api/inquiries/{id}/
PUT /api/inquiries/{id}/
PATCH /api/inquiries/{id}/
DELETE /api/inquiries/{id}/
```

## Inquiry Types

The frontend should send one exact value:

| Value | Display Text |
|---|---|
| `contact_us` | Contact Us |
| `partner_with_us` | Partner With Us |
| `book_consultation` | Book a Consultation |
| `join_training` | Join a Training Program |

## Person Types

The frontend should send one exact value:

| Value | Display Text |
|---|---|
| `entrepreneur` | Entrepreneur / Business Owner |
| `student` | Student |
| `job_seeker` | Job Seeker |
| `training_partner` | Training Partner |
| `investor` | Investor |
| `media_guest` | Media / Podcast Guest |
| `other` | Other |

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | User name |
| `email` | email | Yes | User email |
| `phone` | string | No | Phone number |
| `message` | string | Yes | Inquiry message |
| `person_type` | string | No | Type of person |
| `inquiry_type` | string | No | Purpose of inquiry |

## Example: Contact Us

```json
{
  "name": "Alisha Khan",
  "email": "alisha@example.com",
  "phone": "03001234567",
  "message": "I want to know more about your services.",
  "person_type": "entrepreneur",
  "inquiry_type": "contact_us"
}
```

## Example: Partner With Us

```json
{
  "name": "Alisha Khan",
  "email": "alisha@example.com",
  "phone": "03001234567",
  "message": "I would like to discuss a partnership opportunity.",
  "person_type": "training_partner",
  "inquiry_type": "partner_with_us"
}
```

## Example: Book a Consultation

```json
{
  "name": "Alisha Khan",
  "email": "alisha@example.com",
  "phone": "03001234567",
  "message": "I would like to book a consultation.",
  "person_type": "entrepreneur",
  "inquiry_type": "book_consultation"
}
```

## Example: Join a Training Program

```json
{
  "name": "Alisha Khan",
  "email": "alisha@example.com",
  "phone": "03001234567",
  "message": "I am interested in joining a training program.",
  "person_type": "student",
  "inquiry_type": "join_training"
}
```

## Inquiry Email

After a successful inquiry submission, the backend sends a confirmation email to the email address provided by the user.

The email is sent from the backend's configured email account and uses the user's email as `Reply-To`.

---

# 12. Image Uploads

The following fields are image uploads:

```text
Featured Work → thumbnail
Gallery → image
Testimonials → avatar
Insights → thumbnail, studio_thumbnail
Podcasts → thumbnail
```

For requests containing images, use:

```text
multipart/form-data
```

Do not manually set the multipart `Content-Type` header when using browser `FormData`.

## Frontend Example

```javascript
const formData = new FormData();
formData.append("title", "Future of AI");
formData.append("description", "Podcast description");
formData.append("thumbnail", file);
formData.append("video_url", "https://www.youtube.com/watch?v=XXXXXXXX");

const response = await fetch("http://127.0.0.1:8000/api/podcasts/", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${accessToken}`
  },
  body: formData
});
```

---

# 13. JSON Requests

For requests that do not contain files, send JSON:

```http
Content-Type: application/json
```

Example:

```javascript
const response = await fetch("http://127.0.0.1:8000/api/inquiries/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Alisha Khan",
    email: "alisha@example.com",
    phone: "03001234567",
    message: "I need more information.",
    person_type: "student",
    inquiry_type: "join_training"
  })
});
```

---

# 14. Media URLs

Uploaded images are served from Django's media URL in local development.

Example response value:

```text
/media/podcasts/thumbnails/example.webp
```

The frontend should combine this path with the backend base origin when necessary:

```text
http://127.0.0.1:8000/media/podcasts/thumbnails/example.webp
```

Do not confuse backend uploaded media URLs with static frontend image paths such as:

```text
/images/insights/article-1.webp
```

Those are frontend static assets and are separate from Django media uploads.

---

# 15. Common Frontend Flows

## Insights Page

### Load Categories

```http
GET /api/insight-categories/
```

### Load All Insights

```http
GET /api/insights/
```

### Load Insights for Selected Category

```http
GET /api/insights/?category=digital-commerce
```

### Load Single Insight

```http
GET /api/insights/1/
```

---

## Podcast Page

### Load All Podcasts

```http
GET /api/podcasts/
```

### Load Latest Podcast

```http
GET /api/podcasts/latest/
```

### Load Single Podcast

```http
GET /api/podcasts/1/
```

---

## Inquiry Form

The same form can be used for all four buttons.

```text
Contact Us
Partner With Us
Book a Consultation
Join a Training Program
```

The selected button determines the `inquiry_type` value sent to the backend.

Example:

```text
Book a Consultation
        ↓
inquiry_type = book_consultation
        ↓
POST /api/inquiries/
```

---

# 16. Postman Quick Reference

## GET All Insights

```http
GET http://127.0.0.1:8000/api/blog-posts/
```

## GET Category Insights

```http
GET http://127.0.0.1:8000/api/blog-posts/?category=ai
```

## GET Latest Podcast

```http
GET http://127.0.0.1:8000/api/podcasts/latest/
```

## POST Inquiry

```http
POST http://127.0.0.1:8000/api/inquiries/
```

Body → raw → JSON:

```json
{
  "name": "Alisha Khan",
  "email": "alisha@example.com",
  "phone": "03001234567",
  "message": "I would like to book a consultation.",
  "person_type": "entrepreneur",
  "inquiry_type": "book_consultation"
}
```

## Admin Request Header

For protected endpoints:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

# 17. Notes for Frontend Developers

### `summary` vs `content`

For Insights:

- `summary` = short description for cards/listing.
- `content` = complete detailed article.

### `order` vs `created_at`

- `order` = manually controlled display position.
- `created_at` = automatically generated creation date/time.

The Podcast `latest` endpoint uses `created_at` to return the newest active podcast.

### `category__slug`

The Insights category filter uses the category's slug.

Example:

```text
Category name: Digital Commerce
Category slug: digital-commerce
```

Request:

```http
GET /api/insights/?category=digital-commerce
```

### Video URLs

Podcast and Insight videos are represented with `video_url`. Large video files are not required to be uploaded to the backend for these models.

### Boolean Values

Send JSON booleans as:

```json
true
```

or:

```json
false
```

not strings such as:

```text
"true"
```

when using JSON requests.

---

# 18. Expected Response Shape

A normal list endpoint returns an array of objects when pagination is not enabled.

Example:

```json
[
  {
    "id": 1,
    "title": "Example",
    "is_active": true
  }
]
```

A detail endpoint returns one object:

```json
{
  "id": 1,
  "title": "Example",
  "is_active": true
}
```

> If pagination is enabled later in Django REST Framework settings, the response structure may instead contain keys such as `count`, `next`, `previous`, and `results`.

---

# 19. Error Handling

The frontend should handle common HTTP responses:

| Status | Meaning |
|---|---|
| `200` | Request successful |
| `201` | Resource created |
| `204` | Resource deleted successfully |
| `400` | Validation/request data error |
| `401` | Authentication required or token invalid |
| `403` | User does not have permission |
| `404` | Resource not found |
| `500` | Backend/server error |

Example validation response:

```json
{
  "email": [
    "Enter a valid email address."
  ]
}
```

---

# 20. Integration Checklist

Before frontend integration, confirm:

- Backend server is running.
- Base API URL is correct.
- JWT access token is attached to protected requests.
- Public GET endpoints are accessible without a token.
- Inquiry POST is accessible without a token.
- Image uploads use `multipart/form-data`.
- External videos are sent through `video_url`.
- Insight category filtering uses the category `slug`.
- The four inquiry buttons send the correct `inquiry_type`.
- Uploaded backend images use the Django media URL.

---

# 21. Quick Endpoint List

```text
/api/featured-work/
/api/gallery/
/api/testimonials/
/api/insight-categories/
/api/insights/
/api/insights/?category={slug}
/api/podcasts/
/api/podcasts/latest/
/api/inquiries/
```

---

## New fields

`Podcast` carries `badge` and `badge_colour`; `Venture` carries `accent` and
`border_gradient`. These back design details the site previously hardcoded — the
coloured pill on an episode thumbnail, and a venture card's ring colour and
border gradient. All four are optional: blank falls back to the site's default
palette (episodes cycle teal → pink → purple by position, ventures default to
crimson). `border_gradient` takes a full CSS value, e.g.
`radial-gradient(118% 127% at 50% 50%, #FFFFFF 0%, #A00017 100%)`.

Run `python manage.py migrate` after pulling: `Podcast.0004` and
`ventures.0002` add them.

## Public visibility

Read endpoints hide rows the public should not see, unless the caller is
authenticated staff:

- `is_active=False` rows are omitted from gallery, testimonials, ventures,
  podcasts and insight categories.
- Insights with `publish_status="draft"` are omitted.

`FeaturedWork` has no such flag, so every row is public. `/home` renders the
first by `order`.

---

## End of API Documentation

## Vercel deployment

Insight slugs support up to 255 characters (still a TypeScript string). Migration
`insight_category.0005` preserves existing long slugs when moving from SQLite,
which does not enforce varchar limits, to PostgreSQL.

Deploy this directory as the `people-first-backend` project. `pyproject.toml`
selects the WSGI entrypoint and Python 3.14. Vercel collects admin static assets
using `STATIC_ROOT`. Production requires `SECRET_KEY`, `DEBUG=False`,
`ALLOWED_HOSTS`, `DATABASE_URL` (hosted PostgreSQL with TLS), and
`BLOB_READ_WRITE_TOKEN` (private Blob). Set `CSRF_TRUSTED_ORIGINS` to the backend
origin and `CORS_ALLOWED_ORIGINS` to the frontend origin. Existing `MAIL_*`
variables configure confirmation emails.

Run migrations explicitly before deploying with
`vercel env run -e production -- venv/bin/python manage.py migrate --noinput`.
Uploads use Blob when its token is present, otherwise local `media/`. The media
route only serves files referenced by public content, or by content visible to
an authenticated staff session. Local SQLite and uploads are excluded from
deployments and must be transferred separately.

Deploy `../frontend` as the existing `people-first` project with production
`API_BASE_URL=https://people-first-backend.vercel.app`. This is a server-only
variable. To manage hosted admin accounts, use
`vercel env run -e production -- venv/bin/python manage.py createsuperuser`.

---

# 11. Blog CMS (Media / Events)

Blog posts **are** the site's Insights: the Media / Events page (`/media-events`) and Ideas Lab
read from them. The old Insights admin and `/api/insights/` endpoints were removed; existing
insights were copied into blog posts by migration `blog.0003_import_insights` (the old
`insight_category` tables are kept untouched as a backup).

Posts are written in Django Admin (`/admin/` → **Blog → Blog posts**) with a rich text
editor (django-summernote: headings, bold/italic/underline, colours, lists, links,
tables, inline image upload). Only staff users can log in; create editors with
**Users → Add** and tick *Staff status* plus the `blog` permissions.

- **Draft / publish:** `status` is `draft` or `published`. Publishing stamps `published_at`;
  a future `published_at` schedules the post. The list view has *Publish* / *Unpublish*
  bulk actions. Delete from the list or edit page.
- **SEO:** `slug` (the URL `/blog/<slug>`), `meta_title` (70 chars), `meta_description`
  (160 chars). Both default to the title / excerpt when blank.
- **Featured image** (`featured_image` + `featured_image_alt`) and **categories**
  (`/admin/blog/blogcategory/`).
- Post bodies are sanitised on save (scripts, iframes and event handlers are stripped).

```http
GET /api/blog-posts/                  # published only; no `content`; ?category=<slug>; ordered by `order`, newest first
GET /api/blog-posts/{slug}/           # includes sanitised HTML `content`
GET /api/blog-categories/
POST/PUT/PATCH/DELETE ...             # staff (JWT) only
```

Drafts and scheduled posts are hidden from anonymous callers. Frontend routes: `/media-events`
(category filter, one feature at a time) and `/media-events/<slug>`; `/blog` and `/insights`
redirect there. The optional *Media / Events feature card* fields (metric, stat card, wide
image, video link) are shown on the feature layout when filled and hidden when blank. In
production run `collectstatic` so the editor's assets are served.

## Content Studio (`/cms`)

Editors who should not use Django Admin sign in at **`<site>/cms`** (e.g. `https://peoplefirst.example/cms`):
a branded page to create, edit, publish/unpublish, schedule and delete posts, with a rich text
editor (headings, bold/italic/underline, lists, quotes, links, inline images), featured image,
categories, a Google-style SEO preview, and the Media / Events feature-card fields.

- Sign in with a Django **staff** account (Admin -> Users -> *Staff status*). Non-staff accounts are
  rejected. Django remains the authority: every write is made with the editor's own JWT.
- The Next.js server holds the JWT pair in `httpOnly` cookies scoped to `/cms`; the browser never
  sees `API_BASE_URL`. The page is `noindex` and not linked from the public site.
- Publishing/unpublishing/deleting revalidates `/media-events`, `/ideas-lab` and the sitemap, so
  changes show immediately rather than after the 5-minute content cache.
- API additions: `GET /api/blog-session/` (staff check), `POST /api/blog-uploads/` (staff-only
  inline image upload: JPEG/PNG/GIF/WebP, 5 MB), `GET /api/blog-posts/<slug>/?raw=1` (stored
  excerpt, no auto-fill), and `/api/token/` is throttled to 20 requests/minute.
- **Podcasts tab (`/cms/podcasts`):** add, edit, hide/show and delete episodes; "Fetch from YouTube"
  fills title, thumbnail and duration from a link; "Sync from YouTube" runs the same import as
  `manage.py sync_youtube_podcasts`. Backed by staff-only `POST /api/podcasts/sync/` and
  `GET /api/podcasts/lookup/?url=`.
- **Gallery tab (`/cms/gallery`):** upload several photos at once (10 MB each), reorder with the arrow
  buttons, edit the screen-reader description / caption, hide/show, replace or delete. The home-page
  carousel reads these via `/api/gallery/`. While the gallery is empty the site shows its built-in
  photos; once one photo exists, only the CMS photos are shown.
- Server Actions accept request bodies up to 60 MB (`serverActions.bodySizeLimit` in `next.config.ts`)
  so photo uploads work; the CMS enforces its own per-file limits.
- **Inquiries tab (`/cms/inquiries`):** the website forms' messages as an inbox. Each has a status
  (New / Read / Replied / Archived; opening a new message marks it Read) and private staff notes.
  Search by name, email, phone or message, filter by status and form type, reply by email / call /
  WhatsApp links, delete, and **Export CSV** (respects the current filters; spreadsheet-formula
  characters are neutralised). The nav shows the unread count.
  API: `GET /api/inquiries/` is now paginated (`{count, results}`, 25/page, `?page=`, `?q=`, `?status=`,
  `?type=`), plus `GET /api/inquiries/summary/` and `GET /api/inquiries/export/` (staff only).
  `PUT` is no longer accepted; `PATCH` can change only `status` and `staff_notes`. The public
  `POST /api/inquiries/` is unchanged and cannot set or see either field.
- **Testimonials tab (`/cms/testimonials`):** add, edit (photo, role/handle, quote, comma-separated
  tags), reorder, hide/show, delete. With no photo the site shows a coloured initial.
- **Ventures tab (`/cms/ventures`):** add, edit (logo, tagline, website, colour), reorder, hide/show,
  delete. Card colours are the three design-approved presets (Crimson, Teal, Indigo) or a custom
  accent plus a plain CSS gradient (anything else is rejected, since it ends up in an inline style).
  A venture with no website shows the "coming soon" card.
- As with the gallery, the home page shows its built-in testimonials/ventures until the first one is
  added in the CMS; after that only the CMS entries are shown.
- Forms submit through `useCmsForm` (not `<form action>`), so a failed validation keeps what the
  editor typed instead of resetting the fields.
