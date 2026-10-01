# Deploying People First on Plesk — beginner's guide

This guide takes you from "I have the zip file" to "peoplefirst.pk shows the
real site with real content". Follow the stages **in order**. Each stage ends
with a **Checkpoint** — a quick test that tells you it worked. Do not move on
until the checkpoint passes.

> Plesk's screens change a little between versions. If a button is named
> slightly differently on your server, look for the closest match.

---

## 0. What you are building (read this first)

People First is **two programs** that talk to each other:

| Program | What it does | Technology | Where it will live |
|---|---|---|---|
| **Website** (`frontend/`) | The pages visitors see | Next.js (runs on Node.js) | `https://peoplefirst.pk` |
| **API + admin** (`backend/`) | Stores the content (testimonials, gallery, etc.), the admin login, and receives contact-form messages | Django (runs on Python) | `https://api.peoplefirst.pk` |

The website asks the API for its content every time a page is built or
loaded. A **database** (PostgreSQL) holds the content, and a **media folder**
holds the uploaded images.

```
Visitor's browser ──> peoplefirst.pk (website) ──asks──> api.peoplefirst.pk (API) ──> PostgreSQL + media folder
```

### Words you will see

- **Domain / subdomain** — `peoplefirst.pk` is the domain. `api.peoplefirst.pk`
  is a *subdomain* (a second address under the same domain).
- **DNS** — the internet's address book. A DNS "A record" says "this name lives
  at this server's IP address".
- **SSL certificate** — what makes the padlock / `https://` work. Plesk gets
  free ones from Let's Encrypt.
- **SSH** — typing commands on the server from your own computer's terminal.
- **Environment file (`.env`)** — a small text file of settings and secrets
  (database password, etc.). It is never shared publicly.
- **Virtual environment (virtualenv)** — a private folder of Python libraries
  for one app. Plesk creates it for you.
- **Migration** — a command that creates the tables inside the empty database.
- **Static files / media files** — static = the admin's CSS and icons; media =
  images uploaded to the site. The web server must be told where both live.

---

## 1. Before you start

### What you need

- [ ] Login to Plesk for the server that hosts `peoplefirst.pk` (server IP
      seen earlier: `31.97.220.139`).
- [ ] `people-first-deploy.zip` (this guide is also inside it). **Unzip it on
      your own computer** so you can see the two folders `backend` and
      `frontend`.
- [ ] Access to wherever the DNS for `peoplefirst.pk` is managed (Plesk itself
      or your domain registrar).
- [ ] The server's **Python** and **Node.js** extensions installed, plus
      **PostgreSQL** available. To check: in Plesk open **Tools & Settings →
      Updates → Add/Remove Components**, or look for *Python*, *Node.js* and
      *Databases → PostgreSQL* on the domain's page. If one is missing, ask
      your hosting provider to enable it — nothing below works without it.
- [ ] **SSH access** for the domain (recommended). In Plesk: **Websites &
      Domains → peoplefirst.pk → Web Hosting Access → Access to the server over
      SSH → /bin/bash**. You can then connect from your Mac with
      `ssh USERNAME@31.97.220.139` (username and password are on that same
      Plesk page).

### About secrets

The zip **contains secrets** (`backend/.env` has the secret key and the email
password). Keep the zip private, and **delete it from the server** once
everything is extracted.

---

## 2. Stage 0 — Back up what is there now

`https://peoplefirst.pk` already shows an older static page. Deploying
replaces it, so save it first.

1. Plesk → **Websites & Domains → peoplefirst.pk → Backup Manager → Back Up**.
2. Choose "Back up the domain", then **OK**. Wait until it shows *Completed*.

(Your Vercel copy of the site keeps running untouched the whole time, so you
always have a working version to fall back on.)

---

## 3. Stage 1 — Create the `api` subdomain, DNS and SSL

### 3.1 DNS record

The name `api.peoplefirst.pk` must point at your server.

- If Plesk manages your DNS: **Websites & Domains → peoplefirst.pk → DNS
  Settings → Add Record**, type **A**, name `api`, value `31.97.220.139`.
- If your registrar manages DNS: add the same A record there.

Also confirm there are A records for `peoplefirst.pk` and `www` pointing at
`31.97.220.139` (they should already exist).

### 3.2 Create the subdomain

**Websites & Domains → Add Subdomain** → subdomain name `api`, parent
`peoplefirst.pk` → **OK**.

### 3.3 Turn on HTTPS

Open `api.peoplefirst.pk` in Plesk → **SSL/TLS Certificates → Install a free
basic certificate provided by Let's Encrypt** → **Get it free**. Then in
**Hosting Settings** tick **Permanent SEO-safe 301 redirect from HTTP to
HTTPS**.

**Checkpoint:** open `https://api.peoplefirst.pk` in a browser. You should see
a Plesk default page with a padlock. If the certificate step fails, DNS has
probably not spread yet — wait 15–60 minutes and try again.

---

## 4. Stage 2 — Create the database

1. Plesk → **Websites & Domains → peoplefirst.pk → Databases → Add Database**.
2. Database name: `people_first`. Type: **PostgreSQL**. If you only see MySQL,
   stop and ask your host to install PostgreSQL.
3. Create a database user and a **strong password**. Write down the three
   values: **database name, username, password**. You need them in the next
   stage.

---

## 5. Stage 3 — Put the API online (backend)

### 5.1 Upload the files

The goal: a folder `backend` on the server that contains `manage.py`. This
guide uses `/var/www/vhosts/peoplefirst.pk/backend` (the folder `backend`
inside your subscription's main folder). If your server's path differs, use
yours everywhere below.

Easiest way, using SSH (after uploading `people-first-deploy.zip` through
**File Manager** into your subscription's main folder):

```bash
cd /var/www/vhosts/peoplefirst.pk
unzip people-first-deploy.zip
mv people-first-deploy/backend ./backend
mv people-first-deploy/frontend ./frontend
```

Without SSH: in **File Manager**, upload the zip, right-click → **Extract
Files**, then move the `backend` and `frontend` folders out of
`people-first-deploy` so they sit directly in the main folder.

**Checkpoint:** in File Manager you can open `backend` and see `manage.py`,
`media`, `content.json` and `passenger_wsgi.py`. (Tick **Show hidden files**
in File Manager's settings; you will also see `.env`.)

### 5.2 Fill in the database details

Open `backend/.env` in File Manager (click the file → **Edit**) and replace the
three `FILL_IN` lines with the values from Stage 2:

```
DB_NAME=people_first
DB_USER=the_user_you_made
DB_PASSWORD=the_password_you_made
```

Leave everything else. Save. Never paste this file's contents into chat or
email.

### 5.3 Create the Python app

1. Plesk → **Websites & Domains → api.peoplefirst.pk → Python**.
2. Fill in:
   - **Python version:** 3.12 or newer (the newest available — Django needs it).
   - **Application root:** `backend` (the folder from 5.1).
   - **Application URL:** `api.peoplefirst.pk`.
   - **Application startup file:** `passenger_wsgi.py`
   - **Application entry point:** `application`
3. Click **Enable Python** / **OK** and wait for it to finish.
4. On the same page, click **Install** next to `requirements.txt`. This
   downloads Django and the other libraries. It takes a minute or two.

### 5.4 Create the tables and load the content

You can do this with SSH or with Plesk's **Run script** button.

**Option A — SSH (recommended).** Connect, then activate the app's virtualenv.
The Python page in Plesk shows the virtualenv path; it looks like
`/var/www/vhosts/peoplefirst.pk/.../bin/activate`.

```bash
cd /var/www/vhosts/peoplefirst.pk/backend
source <VIRTUALENV_PATH_FROM_PLESK>/bin/activate

python manage.py migrate
python manage.py loaddata content.json
python manage.py collectstatic --noinput
python manage.py createsuperuser
python manage.py check --deploy
```

What each command does:

- `migrate` — creates the tables in the empty database.
- `loaddata content.json` — loads the real content. You must see
  **`Installed 31 object(s)`**. (The images are already in `backend/media/`.)
- `collectstatic` — gathers the admin's CSS into `backend/staticfiles/`.
- `createsuperuser` — asks for a username, email and password for the admin
  login. Choose a strong password and save it somewhere safe.
- `check --deploy` — prints security hints. A few warnings are fine; errors
  are not.

**Option B — Plesk "Run script".** On the Python page use **Run script**: set
*Script path* `manage.py` and *Arguments* `migrate`, run it; repeat with
`loaddata content.json` and `collectstatic --noinput`. `createsuperuser` asks
questions, so it needs SSH.

When done, delete the file `backend/content.json` (it is no longer needed).

### 5.5 Tell the web server where the files are

Django does not serve images or admin CSS in production, so nginx must.

1. Plesk → **api.peoplefirst.pk → Apache & nginx Settings**.
2. Scroll to **Additional nginx directives** and paste this (change the path if
   yours is not `/var/www/vhosts/peoplefirst.pk/backend`):

```nginx
location /static/ {
    alias /var/www/vhosts/peoplefirst.pk/backend/staticfiles/;
}
location /media/ {
    alias /var/www/vhosts/peoplefirst.pk/backend/media/;
}
```

3. **OK**, then on the Python page click **Restart App**.

Not sure of the path? Over SSH run `cd backend && pwd` and use what it prints.

### Checkpoint 3 — the API works

Open each in a browser:

- `https://api.peoplefirst.pk/api/gallery/` → a list of 3 items (JSON text).
- `https://api.peoplefirst.pk/api/testimonials/` → the 8 testimonials
  (Ayesha Khan, Hassan Raza, …).
- `https://api.peoplefirst.pk/admin/` → a styled login page; log in with the
  superuser you created.
- Copy an `image` address from the gallery response and open it → the picture
  loads.

If something fails, see **Troubleshooting** at the bottom.

---

## 6. Stage 4 — Put the website online (frontend)

> This replaces the old page at `peoplefirst.pk`. You made a backup in Stage 0.

### 6.1 Clear the old site files

The old site's files sit in `httpdocs`. A leftover `index.html` there would be
shown **instead of** the new site, so move them out of the way:
**File Manager → httpdocs**, select everything → **Move** into a new folder
named `old-site-backup` *outside* `httpdocs`.

### 6.2 Check the frontend settings file

`frontend/.env.production` (already in the zip) contains two lines, which tell
the website where the API is:

```
NEXT_PUBLIC_SITE_URL=https://peoplefirst.pk
API_BASE_URL=https://api.peoplefirst.pk
```

Nothing to change. (If `API_BASE_URL` is wrong or missing, the site silently
shows its built-in fallback content instead of the real data.)

### 6.3 Create the Node.js app

1. Plesk → **Websites & Domains → peoplefirst.pk → Node.js**.
2. Fill in:
   - **Node.js version:** 20.9 or newer (the newest available).
   - **Package manager:** npm.
   - **Application mode:** `production`.
   - **Application root:** `frontend` (the folder from 5.1).
   - **Document root:** `httpdocs`.
   - **Application startup file:** `server.js`.
3. Click **Enable Node.js** / **OK**.

### 6.4 Install and build

1. Click **NPM install** and wait. It downloads the libraries (a few minutes).
2. Build the site. Use SSH (recommended):

   ```bash
   cd /var/www/vhosts/peoplefirst.pk/frontend
   npm run build
   ```

   Or use Plesk's **Run script** with the script name `build`.
3. The build prints a list of pages and ends without `error`. It may take
   several minutes. If it stops with "out of memory" or "Killed", your plan
   has too little memory — tell me and we will build it a different way.
4. Click **Restart App**.

The build must be **repeated** any time you change the frontend files or
`.env.production`.

### Checkpoint 4 — the website works

- `https://peoplefirst.pk` shows the new site (not the old page).
- Open `/home`, `/about`, `/insights`, `/podcasts`, `/contact`. The testimonials
  and gallery should be the real content, and images should load.
- If you still see the old page, hard-refresh (Cmd+Shift+R) and check that
  `httpdocs` is empty (6.1).

---

## 7. Stage 5 — Final checks

1. **Contact form:** send a test message at `https://peoplefirst.pk/contact`.
   - It should show a success message.
   - The message appears in the admin: `https://api.peoplefirst.pk/admin/` →
     *Inquiries*.
   - A confirmation email arrives at the address you used. **This has never
     been tested on the live setup** — if the email does not arrive, check your
     spam folder and tell me; the website still saved the message.
2. **Add `www`:** make sure `https://www.peoplefirst.pk` also works (or
   redirects to `https://peoplefirst.pk`). In SSL/TLS for `peoplefirst.pk`,
   re-issue the Let's Encrypt certificate with the **www** option ticked.
3. **Clean up:** delete `people-first-deploy.zip` and the `people-first-deploy`
   folder from the server. They contain your secrets.
4. **Keep the Vercel site** for a few days as a safety net, then retire it.

---

## 8. Day-to-day: how to update later

| I want to… | Do this |
|---|---|
| Change text/images through the admin | Log in at `https://api.peoplefirst.pk/admin/`. No deploy needed. |
| Change frontend code | Upload the changed files to `frontend/`, run `npm install` if `package.json` changed, run `npm run build`, **Restart App**. |
| Change backend code | Upload the files to `backend/`, run `pip install -r requirements.txt` (if needed), `python manage.py migrate`, `collectstatic --noinput`, then **Restart App**. |
| Change a setting in `.env` | Edit the file, then **Restart App** (and rebuild the frontend if it was the frontend file). |

Uploaded images go into `backend/media/`. Keep that folder — and the database —
in your backups.

---

## 9. Troubleshooting

**First step for any problem:** read the log. Plesk → the domain → **Logs** (or
**Python**/**Node.js** page → *Logs*). The last lines usually name the problem.

| What you see | Likely cause and fix |
|---|---|
| `api...` shows a Passenger / "Web application could not be started" page | Open **Logs**. Usually a missing library (run **Install** for `requirements.txt` again) or a typo in `.env`. Fix, then **Restart App**. |
| `Bad Request (400)` / `DisallowedHost` | `ALLOWED_HOSTS` in `backend/.env` must be exactly `api.peoplefirst.pk`. |
| Admin login page has no styling | `/static/` nginx block missing or wrong path (5.5), or `collectstatic` was not run. |
| Admin login says "CSRF verification failed" | `CSRF_TRUSTED_ORIGINS=https://api.peoplefirst.pk` in `.env`, and the site must be opened with `https://`. Restart the app. |
| Images are broken (404) | `/media/` nginx block missing or wrong path (5.5), or the `backend/media/` folder was not uploaded. |
| Database errors (`could not connect`, `password authentication failed`) | The three `DB_*` values in `backend/.env` do not match the database from Stage 2. Edit and restart. |
| The website loads but shows placeholder content | The API returned nothing or the site cannot reach it. Open `https://api.peoplefirst.pk/api/gallery/`. If that works, check `API_BASE_URL` in `frontend/.env.production`, then **rebuild** and restart. |
| The website still shows the old page | Old files left in `httpdocs` (6.1); hard-refresh. |
| `npm run build` says "Killed" / out of memory | Not enough RAM on the plan; ask me for an alternative. |
| Contact form says it failed | The website could not reach the API (check the row above) — it never shows a false success. |
| No confirmation email | Check spam. The message is still saved in the admin. Check the `MAIL_*` lines in `backend/.env` and the backend log. |

### Rolling back

If the new site is broken and you need the old one quickly: Plesk →
**Backup Manager → Restore** the backup from Stage 0, and on the **Node.js**
page disable the app. The Vercel copy also stays available.

---

## 10. Quick reference

| Item | Value |
|---|---|
| Website | `https://peoplefirst.pk` |
| API | `https://api.peoplefirst.pk/api/…` |
| Admin | `https://api.peoplefirst.pk/admin/` |
| Backend folder | `/var/www/vhosts/peoplefirst.pk/backend` |
| Frontend folder | `/var/www/vhosts/peoplefirst.pk/frontend` |
| Backend start file | `passenger_wsgi.py` (entry point `application`) |
| Frontend start file | `server.js` |
| Secrets files (keep private) | `backend/.env` |
