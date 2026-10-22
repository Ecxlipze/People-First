# People First deployment

## Current production and SEO release — 22 October 2026

The current public frontend is **https://peoplefirst.pk**, served through
nginx/Plesk. Public media is also served from https://api.peoplefirst.pk.
The Vercel notes below are historical; the old frontend Vercel hostname now
returns `DEPLOYMENT_NOT_FOUND`.

This release contains metadata/social previews, structured-data corrections,
self-canonicals for the distinct landing and home pages, sitemap corrections,
the Insights venture link to `/media-events`, and absolute article share URLs
that work in the initial HTML without JavaScript. Visible copy and layout are
unchanged. Existing API records with the obsolete Insights URL are overridden
by the frontend content loader; no database migration is required.

Deploy the complete `frontend/` changes, including `next.config.ts` and
`public/images/og/people-first.png`, using the existing Plesk deployment process.
Keep the production environment and uploaded media; do not upload `.env.local`,
the local database, local media fixtures, or macOS `node_modules`.

Before building, verify production `NEXT_PUBLIC_SITE_URL=https://peoplefirst.pk`
and retain the existing production `API_BASE_URL`. Install from the lockfile,
run `npm run build` in the frontend application directory, and restart the
existing application through its configured hosting process.

### Hosting action still required

The observed TLS certificate covers `peoplefirst.pk` but **not**
`www.peoplefirst.pk`. Issue/renew the certificate to cover both names in Plesk.
The application now permanently redirects the exact `www.peoplefirst.pk` host
to `https://peoplefirst.pk`, preserving paths and query parameters. The www
hostname must reach this app, or have an equivalent redirect configured on the
web server. Application code cannot repair a TLS failure that occurs before
the HTTP request reaches the app.

### After deployment

- Verify HTTPS works for both hostnames and www redirects to the apex domain.
- Check `/home` Insights opens `https://peoplefirst.pk/media-events`.
- Inspect an article's original HTML: social share URLs should contain the
  full `https://peoplefirst.pk/media-events/...` destination before hydration.
- Verify `/` and `/home` each declare their own canonical URL.
- Check `/sitemap.xml` includes `/` and `/gallery`, excludes noindex routes,
  omits static-page `lastmod`, and retains actual CMS article update dates.
- Confirm the branded preview image loads and public pages remain crawlable.
- Submit `https://peoplefirst.pk/sitemap.xml` in the domain's webmaster tools
  and inspect indexing there. Actual indexing was not confirmed by this audit.

The LinkedIn profile returned an automated-request block (HTTP 999); this is
not a confirmed broken link and its destination was preserved.

## Historical Vercel deployment

Production verified on 2026-09-29:

- Frontend: https://peoples-first.vercel.app
- Backend API: https://people-first-backend.vercel.app/api/gallery/
- Admin: https://people-first-backend.vercel.app/admin/
- Vercel projects: `people-first` (deploy from `frontend/`) and
  `people-first-backend` (deploy from `backend/`).
- Persistent data: Neon `people-first-db`; private Blob `people-first-media`.

Transferred 31 content records and verified exact field equality with the local
export. Uploaded 40 media files and verified SHA256 equality after downloading
from Blob. Copied the existing local staff account at the owner's request.
Existing inquiries and sessions were not copied.

Verification: frontend lint, TypeScript, local production build and both Vercel
builds passed. Django system checks, migration consistency and `git diff --check`
passed. All 15 public frontend routes and seven content API endpoints returned
200. All 16 distinct media URLs referenced by public API records returned image
responses; Next.js image optimization returned 200. The live homepage, gallery
and admin login were inspected in a browser. This was deployment smoke testing,
not a full responsive/interaction audit.

The inquiry endpoint rejects invalid POSTs (400) and unauthenticated reads
(401). SMTP connection/authentication succeeded locally with the configured
credentials; no email was sent and live email delivery remains unverified.
Recent frontend/backend error-log queries returned no entries.

Deployment changes add hosted PostgreSQL, durable Blob storage, static admin
assets, HTTPS proxy settings and trusted origins. Insight slugs were widened to
255 characters to preserve existing local URLs under PostgreSQL's strict length
limits. `frontend/public/images.zip` stays local and is excluded from upload
because it exceeds Vercel's file-size limit.

The deployed source includes pre-existing uncommitted user changes. No Git
commit or push was made. Production variables are managed in Vercel; do not
commit exported environment files or transfer fixtures. Sensitive Vercel values
are redacted when pulled, so a pulled file is not a complete runtime environment.
