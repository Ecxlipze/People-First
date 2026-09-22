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
http://127.0.0.1:8000/api/insights/
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
| Ventures | GET | `/api/ventures/` | Public |
| Ventures Detail | GET | `/api/ventures/{id}/` | Public |
| Ventures | POST | `/api/ventures/` | Admin |
| Ventures | PUT | `/api/ventures/{id}/` | Admin |
| Ventures | PATCH | `/api/ventures/{id}/` | Admin |
| Ventures | DELETE | `/api/ventures/{id}/` | Admin |
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
| Insight Categories | GET | `/api/insight-categories/` | Public |
| Insight Categories Detail | GET | `/api/insight-categories/{id}/` | Public |
| Insight Categories | POST | `/api/insight-categories/` | Admin |
| Insight Categories | PUT | `/api/insight-categories/{id}/` | Admin |
| Insight Categories | PATCH | `/api/insight-categories/{id}/` | Admin |
| Insight Categories | DELETE | `/api/insight-categories/{id}/` | Admin |
| Insights | GET | `/api/insights/` | Public |
| Insight Detail | GET | `/api/insights/{id}/` | Public |
| Insight Filter | GET | `/api/insights/?category={slug}` | Public |
| Insights | POST | `/api/insights/` | Admin |
| Insights | PUT | `/api/insights/{id}/` | Admin |
| Insights | PATCH | `/api/insights/{id}/` | Admin |
| Insights | DELETE | `/api/insights/{id}/` | Admin |
| Podcasts | GET | `/api/podcasts/` | Public |
| Podcast Detail | GET | `/api/podcasts/{id}/` | Public |
| Latest Podcast | GET | `/api/podcasts/latest/` | Public |
| Podcasts | POST | `/api/podcasts/` | Admin |
| Podcasts | PUT | `/api/podcasts/{id}/` | Admin |
| Podcasts | PATCH | `/api/podcasts/{id}/` | Admin |
| Podcasts | DELETE | `/api/podcasts/{id}/` | Admin |
| Inquiries | POST | `/api/inquiries/` | Public |
| Inquiries | GET | `/api/inquiries/` | Admin |
| Inquiry Detail | GET | `/api/inquiries/{id}/` | Admin |
| Inquiries | PUT | `/api/inquiries/{id}/` | Admin |
| Inquiries | PATCH | `/api/inquiries/{id}/` | Admin |
| Inquiries | DELETE | `/api/inquiries/{id}/` | Admin |

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

# 5. Ventures API

## Endpoints

```http
GET    /api/ventures/
GET    /api/ventures/{id}/
POST   /api/ventures/
PUT    /api/ventures/{id}/
PATCH  /api/ventures/{id}/
DELETE /api/ventures/{id}/
```

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `logo` | image | No | Venture logo |
| `name` | string | Yes | Venture name |
| `subtitle` | string | No | Short subtitle |
| `website_url` | URL | No | Website URL |
| `display_order` | integer | No | Display order |
| `is_active` | boolean | No | Whether the venture is active |

## JSON Example

```json
{
  "name": "People First Ventures",
  "subtitle": "Building innovative businesses",
  "website_url": "https://example.com",
  "display_order": 1,
  "is_active": true
}
```

For `logo`, use `multipart/form-data`.

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
| `social_url` | URL | No | Social/profile URL |
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
  "social_url": "https://linkedin.com/",
  "display_order": 1,
  "is_active": true
}
```

For `avatar`, use `multipart/form-data`.

If the backend serializer exposes `hasAvatar`, it is generated from the `avatar` field and should not be submitted from the frontend.

---

# 8. Insight Categories API

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

# 9. Insights API

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

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Podcast title |
| `slug` | string | Yes | URL-friendly unique slug |
| `description` | string | Yes | Podcast description |
| `thumbnail` | image | No | Podcast thumbnail |
| `video_url` | URL | No | External video URL |
| `metric_value` | string | No | Metric value, e.g. `50+` |
| `metric_label` | string | No | Metric label, e.g. `clients` |
| `supporting_title` | string | No | Supporting section title, e.g. `Concept` |
| `supporting_content` | string | No | Supporting section text |
| `order` | integer | No | Display order |
| `is_active` | boolean | No | Whether podcast is active |

## JSON Example

```json
{
  "title": "Future of Artificial Intelligence",
  "slug": "future-of-artificial-intelligence",
  "description": "A discussion about the future of AI and emerging technologies.",
  "video_url": "https://www.youtube.com/watch?v=XXXXXXXX",
  "metric_value": "50+",
  "metric_label": "clients",
  "supporting_title": "Concept",
  "supporting_content": "For more than 50 years, global stage for innovation.",
  "order": 1,
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
Ventures → logo
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
GET http://127.0.0.1:8000/api/insights/
```

## GET Category Insights

```http
GET http://127.0.0.1:8000/api/insights/?category=ai
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
/api/ventures/
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

## End of API Documentation
