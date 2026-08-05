# Turning on the "Notify Me" signup form

**For:** the site owner
**Time needed:** about 10 minutes, once
**Cost:** free

Your two coming-soon pages each have an email signup box. Right now a visitor
can type their address and gets a friendly "Thanks!" — but **the address isn't
saved anywhere yet**. This guide switches on the saving part, so every signup
lands in a Google Spreadsheet you own.

You don't need to know any code. You'll copy one block of text, click through a
few Google menus, and paste one link into two files.

> **You can put the pages online before doing this.** The form won't error or
> look broken — it just won't record anything. Nothing else on the page depends
> on it.

---

## What you'll end up with

A spreadsheet that fills itself in, one row per signup:

| Timestamp           | Email             | Source        |
| ------------------- | ----------------- | ------------- |
| 2026-08-04 14:02:11 | ayesha@email.com  | merchanity    |
| 2026-08-04 14:09:47 | bilal@email.com   | people-first  |

The **Source** column tells you which of the two pages someone signed up from,
so a single spreadsheet can serve both sites.

---

## Step 1 — Make the spreadsheet

1. Go to **<https://sheets.new>** (this creates a new blank spreadsheet).
2. Give it a name, e.g. `Launch Signups`, by clicking "Untitled spreadsheet" at
   the top left.
3. In the very first row, type these three column headings — one per cell:

   - Cell **A1**: `Timestamp`
   - Cell **B1**: `Email`
   - Cell **C1**: `Source`

Spelling and order matter here, so double-check them before moving on.

---

## Step 2 — Add the code that receives signups

1. In the spreadsheet's top menu, click **Extensions → Apps Script**.
   A new tab opens with a code editor.
2. You'll see a small amount of sample code (usually `function myFunction() {}`).
   **Select all of it and delete it**, so the file is completely empty.
3. Copy **everything** in the grey box below and paste it into that empty file.

```javascript
/**
 * Receives signups from the coming-soon pages and adds them to the sheet.
 */

var ALLOWED_SOURCES = ['people-first', 'merchanity'];

function doPost(e) {
  try {
    if (!e || !e.parameter) return _out({ ok: false, error: 'no data' });

    var email  = String(e.parameter.email  || '').trim();
    var source = String(e.parameter.source || 'unknown').trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
      return _out({ ok: false, error: 'invalid email' });
    }
    if (ALLOWED_SOURCES.indexOf(source) === -1) source = 'unknown';

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

      var last = sheet.getLastRow();
      if (last > 1) {
        var rows = sheet.getRange(2, 2, last - 1, 2).getValues();
        for (var i = 0; i < rows.length; i++) {
          var seenEmail  = String(rows[i][0]).trim().toLowerCase();
          var seenSource = String(rows[i][1]).trim();
          if (seenEmail === email.toLowerCase() && seenSource === source) {
            return _out({ ok: true, duplicate: true });
          }
        }
      }

      sheet.appendRow([new Date(), email, source]);
    } finally {
      lock.releaseLock();
    }

    return _out({ ok: true });
  } catch (err) {
    return _out({ ok: false, error: String(err) });
  }
}

function doGet() {
  return _out({ ok: true, status: 'ready' });
}

function _out(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Click the **save icon** (the floppy disk), or press **Cmd+S** / **Ctrl+S**.

---

## Step 3 — Publish it and get your link

1. Top right of the Apps Script editor: click **Deploy → New deployment**.
2. Next to "Select type", click the **gear icon** and choose **Web app**.
3. Fill in the form exactly like this:

   | Field               | Set it to        |
   | ------------------- | ---------------- |
   | Description         | `signup receiver` (any text is fine) |
   | Execute as          | **Me**           |
   | Who has access      | **Anyone**       |

   ⚠️ **"Who has access" must be "Anyone."** This is the single most common
   thing to get wrong. If it's set to anything else, signups will silently fail.
   (See "Is this safe?" below — this does **not** let anyone read your data.)

4. Click **Deploy**.
5. Google will ask you to **authorise** the script. Because this is your own
   private script, Google shows a scary-looking warning that it's "unverified."
   This is normal and expected. Click:
   - **Advanced** (bottom left of the warning)
   - then **Go to (your project name) (unsafe)**
   - then **Allow**
6. You'll now see a **Web app URL** that looks like this:

   ```
   https://script.google.com/macros/s/AKfycbx...long...string/exec
   ```

   **Copy it.** This is the link you need for the next step.

---

## Step 4 — Paste the link into your two pages

Open **`people-first.html`** in any plain text editor (TextEdit, Notepad,
VS Code — anything that isn't Word).

Search for `SHEET_ENDPOINT`. You'll find this line:

```javascript
  var SHEET_ENDPOINT = '';
```

Paste your link between the two quote marks:

```javascript
  var SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx.../exec';
```

Save the file. **Now do exactly the same thing in `merchanity.html`.**

Both files use the same link — the pages already tell the spreadsheet which one
they are.

> Keep the quote marks. `= '';` becomes `= 'https://...';` — don't remove the
> `'` characters or the semicolon.

---

## Step 5 — Test that it works

1. Open one of the pages in your browser (double-click the `.html` file).
2. On the Merchanity page, click **NOTIFY ME** to reveal the email box.
3. Type a real email address and submit.
4. You should see a green **"Thanks! We'll let you know the moment we launch."**
5. Switch to your spreadsheet — **a new row should appear within a few seconds.**

Try submitting the *same* address twice. You'll get the thank-you both times,
but only one row is added — duplicates are filtered automatically.

---

## If a row doesn't appear

Work through these in order; the first one fixes it most of the time.

1. **Check "Who has access" is "Anyone."**
   In Apps Script: **Deploy → Manage deployments → the pencil (edit) icon**.
   Fix it if needed, then **Deploy** again.

2. **Check the link was pasted correctly.**
   It must end in `/exec` — not `/dev`. And the quote marks must still be there.

3. **Test the link directly.**
   Paste your Web app URL into a browser address bar. You should see:
   ```
   {"ok":true,"status":"ready"}
   ```
   If you get a Google **sign-in page** instead, access is still restricted —
   go back to fix #1.

4. **Did you edit the code after publishing?**
   Code changes don't go live until you re-publish as a **new version**:
   **Deploy → Manage deployments → pencil icon → Version: New version → Deploy.**

---

## Is this safe?

**Yes.** Setting access to "Anyone" is required because your visitors aren't
logged into your Google account — the page has to be able to reach the script
anonymously.

But the script can only do **one** thing: add a row. It has no code to read,
list, edit, or delete anything. Even if someone found your link, they could not
see a single email address you've collected. Your spreadsheet itself stays
private to your Google account as normal.

The script also protects itself: it rejects anything that isn't a properly
formatted email address, ignores unrecognised source values, and filters
duplicates.

---

## Everyday use

**Getting the list out:** In the spreadsheet, **File → Download → CSV** — that
opens in Excel or imports into any mailing tool.

**Getting notified of new signups:** In the spreadsheet, **Tools →
Notification settings → Edit notifications** → notify me when "any changes are
made." Google will email you as signups arrive.

**Sending your launch announcement:** This setup *collects* addresses; it
doesn't send email. When you're ready to launch, export the CSV and use it with
whatever you send from (Mailchimp, Gmail, Outlook, etc.).

**Separate spreadsheets per site:** If you'd rather keep the two sites' lists
apart, just repeat Steps 1–3 for a second spreadsheet and paste that second link
into the other page.

---

## Two other things to set before launch

There are two more placeholders worth filling in, both marked `EDIT ME` in the
files. **Both apply to `people-first.html` only** — the Merchanity page has
neither a countdown nor social icons, so once its endpoint is in from Step 4,
that page is finished.

**1. The countdown date — `people-first.html`.** Search for `LAUNCH` and you'll
find:

```javascript
  var LAUNCH = '2026-08-29T12:00:00+05:00';
```

Change it to your real launch moment. The format is
`YYYY-MM-DDTHH:MM:SS+05:00`, where `+05:00` is Pakistan time. For example,
1 October 2026 at 9am becomes `'2026-10-01T09:00:00+05:00'`. When the countdown
reaches zero it stops at `00`.

**2. Social media links — `people-first.html`.** Search for `href="#"` — there
are four, labelled Facebook, LinkedIn, Instagram, and YouTube. Replace each `#`
with your real profile address:

```html
<a href="https://facebook.com/yourpage" aria-label="Facebook" ...>
```

Any icon you don't want, delete the whole `<a>...</a>` block for it.
