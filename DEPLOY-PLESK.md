# Deploying People First on Plesk

Two Plesk sites: the Next.js frontend (Node.js extension) and the Django API
(Python extension). Domain: `peoplefirst.pk` (frontend) and `api.peoplefirst.pk` (API).

| Part | Plesk domain | Runs as |
|---|---|---|
| `frontend/` | `peoplefirst.pk` | Node.js extension, `next start` |
| `backend/` | `api.peoplefirst.pk` | Python extension, Passenger WSGI |
| Database | Plesk PostgreSQL | replaces Neon |
| Uploaded media | `backend/media/` on disk | replaces Vercel Blob |

Prerequisites: the Node.js (>= 20.9) and Python extensions installed, SSH access,
and a Let's Encrypt certificate on both domains.

## Using `people-first-deploy.zip`

The zip holds `backend/` (with `media/` and `content.json` already inside),
`frontend/` and this guide. It excludes `venv`, local databases and
`node_modules`/`.next`. It **contains secrets** (`backend/.env` has a generated
`SECRET_KEY` and the SMTP login): keep the zip private and delete it from the
server after extracting. Extract it on your computer first, then:

- Upload the contents of `backend/` to the `api.peoplefirst.pk` app folder so
  that `backend/manage.py` exists there (Section 2). The content and media in
  Section 4 are already in place, so skip its export/zip steps and only run
  `loaddata`.
- Upload `frontend/` to the `peoplefirst.pk` app folder (Section 3), then run
  `npm install` and `npm run build` on the server.
- `backend/.env` is production-ready except `DB_NAME`, `DB_USER` and
  `DB_PASSWORD` (marked `FILL_IN`): edit them with the Plesk database details
  from Section 1. `frontend/.env.production` already sets both frontend
  variables, so Section 3 step 3 is only a fallback. Dotfiles are hidden in
  Plesk File Manager; enable "Show hidden files".
- Run the commands in this guide after uploading.

## 1. Database

Plesk > Databases > Add Database (PostgreSQL). Note the name, user, password.

## 2. Backend (`api.peoplefirst.pk`)

1. Upload `backend/` to the subdomain's folder (Git or SFTP). Do **not** upload
   `venv/`, `db.sqlite3`, `media/` or `.env`.
2. Python extension: set Application root to the `backend` folder, Startup file
   to `passenger_wsgi.py`, Application URL to the subdomain. Enable the app.
3. Click **Install requirements.txt** (or SSH: `pip install -r requirements.txt`
   inside the app's virtualenv).
4. Create `backend/.env` on the server (never commit it):

   ```
   SECRET_KEY=<new long random value>
   DEBUG=False
   ALLOWED_HOSTS=api.peoplefirst.pk
   CSRF_TRUSTED_ORIGINS=https://api.peoplefirst.pk
   CORS_ALLOWED_ORIGINS=https://peoplefirst.pk,https://www.peoplefirst.pk
   DB_ENGINE=postgresql
   DB_NAME=...
   DB_USER=...
   DB_PASSWORD=...
   DB_HOST=127.0.0.1
   DB_PORT=5432
   MAIL_MAILER=smtp
   MAIL_HOST=...
   MAIL_PORT=587
   MAIL_USERNAME=...
   MAIL_PASSWORD=...
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=...
   MAIL_FROM_NAME="People First"
   ```

   Leave `BLOB_READ_WRITE_TOKEN` and `DATABASE_URL` unset. With `DEBUG=False`
   the app now trusts `X-Forwarded-Proto` and sets secure cookies.
5. In the app's environment (SSH, virtualenv active):

   ```bash
   python manage.py migrate
   python manage.py collectstatic --noinput
   python manage.py createsuperuser
   python manage.py check --deploy
   ```

6. **Static and media files.** Django does not serve `/media/` when
   `DEBUG=False`, and `/static/` is not served by it either. Have nginx serve
   both. Plesk > the API domain > Apache & nginx Settings > *Additional nginx
   directives* (adjust the path to the real subscription root):

   ```nginx
   location /static/ {
       alias /var/www/vhosts/peoplefirst.pk/api.peoplefirst.pk/backend/staticfiles/;
   }
   location /media/ {
       alias /var/www/vhosts/peoplefirst.pk/api.peoplefirst.pk/backend/media/;
   }
   ```

   The directories must be readable by the subscription's system user.
   Without `/static/` the admin has no CSS; without `/media/` every uploaded
   image 404s.
7. Restart the app (Python extension > Restart App) after every code or
   `.env` change. Passenger also restarts when `tmp/restart.txt` is touched.

## 3. Frontend (`peoplefirst.pk`)

1. Upload `frontend/` without `node_modules/` and `.next/`.
2. Node.js extension: Node >= 20.9, Application root `frontend`, Application
   mode `production`, Application startup file `server.js` (in the repo; it
   runs the normal production Next.js server and needs `npm run build` first).
3. Set custom environment variables in the extension:

   ```
   NEXT_PUBLIC_SITE_URL=https://peoplefirst.pk
   API_BASE_URL=https://api.peoplefirst.pk
   ```

   `NEXT_PUBLIC_SITE_URL` is baked in at build time; rebuild if it changes.
4. Click **NPM install**, then run the build (SSH or "Run script"):

   ```bash
   npm run build
   ```

5. Restart the app. `next.config.ts` derives the allowed image host from
   `API_BASE_URL`, so API media loads once the nginx `/media/` mapping exists.

## 4. Load the content (required for real data, no fallbacks)

Without this the API returns empty lists and the site shows its built-in
fallback content. Source: the local database and `backend/media/`.

Locally (from `backend/`, output outside the repo):

```bash
./venv/bin/python manage.py dumpdata featured_work gallery testimonial ventures Podcast insight_category --natural-foreign --natural-primary --indent 2 -o ~/Desktop/People-First-deploy/content.json
zip -qr ~/Desktop/People-First-deploy/media.zip media
```

On Plesk: extract `media.zip` into `backend/` (giving `backend/media/gallery/...`),
upload `content.json` to `backend/`, then from `backend/`:

```bash
python manage.py loaddata content.json
```

Expect `Installed 31 object(s)`. Delete `content.json` afterwards. Inquiries,
sessions and users are not exported; create the admin with `createsuperuser`.
Do not commit `content.json` or `media.zip`. If content was edited on the live
Vercel site after the local database was last updated, export from that
database instead.

## 5. Cutover and verification

Point DNS (A records for `@`, `www`, `api`) at the Plesk server, then check:

- `https://api.peoplefirst.pk/api/gallery/` returns JSON.
- `https://api.peoplefirst.pk/admin/` loads with styling and login works.
- A media URL from the API response returns an image.
- The site renders real content (not only fallbacks) and images load.
- Submit the contact form; confirm the inquiry appears in admin **and** the
  confirmation email arrives. Email delivery has never been verified live.

Keep the Vercel deployment running until all checks pass.

## Updating later

- Backend: upload changes, `pip install -r requirements.txt` if needed,
  `migrate`, `collectstatic`, restart app.
- Frontend: upload changes, NPM install if `package.json` changed,
  `npm run build`, restart app.
