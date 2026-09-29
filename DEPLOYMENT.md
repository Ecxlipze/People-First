# People First deployment

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
