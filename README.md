# People First

People First is a design-led marketing website and venture ecosystem built on a
highly visual, motion-heavy architecture. The platform introduces users to the
brand’s focus areas, venture studios, and growth partnerships through a curated,
interactive experience.

This is a single repository holding both halves of the product:

```text
├── frontend/   Next.js 16 marketing site (App Router, React 19, Tailwind 4)
├── backend/    Django 6 + DRF content and inquiry API
├── coming-soon/  Standalone FTP-deployed holding page (outside the Next build)
├── output/, tmp/, QA Report/   QA reports and evidence
└── PROJECT_DOCUMENTATION.md    Frontend architecture deep-dive
```

For a comprehensive frontend technical handover, architectural deep-dive, and
route reference, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).
For the API reference, see [backend/README.md](./backend/README.md).

## Tech stack

| | |
| :--- | :--- |
| Frontend | Next.js 16.3.0 (App Router), React 19.2.4, Tailwind CSS 4, TypeScript, Lucide React |
| Backend | Django 6.1, Django REST Framework, SimpleJWT, django-cors-headers, PostgreSQL |

## Prerequisites

- **Node.js** v20.9.0 or newer, **npm** v10+
- **Python** 3.12+ and a reachable **PostgreSQL** instance

## Getting started

Both halves run independently. The frontend only needs the backend for the
contact form today; every other page still renders from local content modules.

### Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env     # fill in SECRET_KEY and the DB_* values
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API is then served at `http://127.0.0.1:8000/api/` and the Django admin at
`http://127.0.0.1:8000/admin/`.

`CORS_ALLOWED_ORIGINS` in `backend/.env` must list every browser origin that
calls the API directly. The Next.js server calls it server-to-server, which CORS
does not apply to, but keep `http://localhost:3000` listed for local debugging.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # point API_BASE_URL at the running backend
npm run dev
```

The site is then available at [http://localhost:3000](http://localhost:3000).

## Environment variables

### `frontend/.env.local`

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Required at production build time. Absolute public origin used for canonical tags, JSON-LD, the sitemap, and robots metadata. Trailing slashes are normalized. In development it falls back to `http://localhost:3000`. | `https://www.example.com` |
| `API_BASE_URL` | Origin of the Django API. Server-only by design (not `NEXT_PUBLIC_*`), so the API origin never reaches the client bundle. | `http://127.0.0.1:8000` |

### `backend/.env`

See [backend/.env.example](./backend/.env.example) for the full list:
`SECRET_KEY`, `DEBUG`, the five `DB_*` values, `CORS_ALLOWED_ORIGINS`, and the
`MAIL_*` / `EMAIL_BACKEND` mail settings.

## Validation commands

Run these from `frontend/` before committing frontend changes:

- **Lint**: `npm run lint`
- **Type check**: `npx tsc --noEmit`
- **Build**: `npm run build`

From `backend/`:

- **Checks**: `python manage.py check`
- **Migrations up to date**: `python manage.py makemigrations --check --dry-run`

There is no automated test suite on either side.

## Frontend structure summary

```text
frontend/
├── app/                  # Next.js App Router root
│   ├── components/       # Shared cross-route UI components
│   ├── contact/          # Contact form, modal, server action, API enum mapping
│   ├── lib/              # Shared utilities — api.ts (Django client), seo.ts, nav.ts
│   ├── sitemap.ts        # Dynamic sitemap generator
│   ├── robots.ts         # Crawler directives
│   ├── globals.css       # Tailwind 4 theme, layout constraints, & tokens
│   ├── layout.tsx        # Global metadata, fonts, and layout wrappers
│   └── page.tsx          # Standalone radial landing experience
├── public/images/        # Static assets, graphics, and design mockups
├── package.json
└── next.config.ts
```

## Backend structure summary

```text
backend/
├── people_first/   settings, root urls, wsgi/asgi
├── featured_work/  gallery/  insight_category/  Podcast/  testimonial/  ventures/
│                   Public read APIs; admin-only writes
├── inquiry/        Public POST /api/inquiries/ — backs the site contact form
├── requirements.txt
└── README.md       Full endpoint reference
```

## Main routes

- `/` (Landing Page)
- `/home` (Main Content Dashboard)
- `/about` (About Us)
- `/what-we-do` (Ventures & Impact)
- `/grow-with-us` (Partnerships)
- `/ideas-lab` (Studio Overview)
- `/insights` (Editorial Content)
- `/podcasts` (Media Content)
- `/contact` (Primary Contact Form)
- `/privacy` (Privacy Policy)
- `/terms` (Terms & Conditions)
- `/cookies` (Cookie Policy)
- `/partner` (Contact form with partner preselection; `noindex`)
- `/training` (Contact form with training preselection; `noindex`)

`/contact-us` permanently redirects to `/contact` with HTTP 308.

## Frontend ↔ backend wiring status

| Area | Status |
| :--- | :--- |
| Contact form (`/contact`, `/partner`, `/training`, and the site-wide modal) | **Wired.** The server action POSTs to `/api/inquiries/`, mapping the "I am a" choice to `person_type` and the route to `inquiry_type`. The API persists the inquiry and emails the submitter a confirmation. |
| Featured work, gallery, testimonials, ventures, insights, podcasts | **Not wired yet.** These still render from the local content modules beside each route. The matching API endpoints exist and are documented in `backend/README.md`. |

## Deployment basics

The frontend runs on any Next.js-compatible Node host. On Vercel, set the
project's **Root Directory** to `frontend` — the repository root is no longer
the Next.js app.

1. Install dependencies with `npm ci` in `frontend/`.
2. Set `NEXT_PUBLIC_SITE_URL` to the final public origin and `API_BASE_URL` to
   the deployed API origin.
3. Run `npm run build`, then `npm run start` (or the host's equivalent).

The backend is a standard WSGI Django app (`people_first.wsgi`). It needs
`DEBUG=False`, a populated `ALLOWED_HOSTS`, a real `SECRET_KEY`, PostgreSQL,
configured SMTP, and a static/media file strategy before production use.

---
*For more extensive frontend engineering context — responsive constraints,
animation architecture, and SEO setup — read the
[Detailed Project Documentation](./PROJECT_DOCUMENTATION.md).*
