# NMSMUN website

Static website for **NMSMUN** — the Model United Nations conference hosted by
GEMS New Millennium School, Dubai.

Plain HTML, CSS and JavaScript. No build step, no framework, no dependencies.
Upload the folder to any static host (GitHub Pages, Netlify, Cloudflare Pages,
school web server) and it works.

---

## Files

```
index.html          Home
about.html          About — history & Secretariat
conference.html     Conference — committees, schedule, venue, gallery
resources.html      Resources — handbook, template, FAQ
application.html    Application — delegate application form
portal.html         Delegate Portal (locked preview)

css/styles.css      All styling. Brand colours live at the very top.
js/site.js          Header, footer, animations, countdown, form logic.
assets/             Logos and favicon (SVG placeholders — replace these).

_headers            HTTP security headers for Netlify / Cloudflare Pages.
.htaccess           The same security headers for an Apache host.
```

---

## Where to edit things

### Header & footer (same on every page)
Open **`js/site.js`** and edit the `SITE_CONFIG` object at the top:
navigation links, footer columns, contact email, school name, and the
**countdown target date**.

### Page text
Edit the relevant `.html` file directly. Every page is plain HTML with
comments marking each section. Search for the text you want to change and
type over it.

### Countdown date
In `js/site.js` → `SITE_CONFIG`:
```js
countdownTargetISO: "2026-10-02T09:00:00+04:00",  // conference opens 2 Oct 2026
countdownDateIsConfirmed: true,                   // false = show "DATE TBA" instead of the date
```

### Logos
Replace the files in `assets/` (`logo-nmsmun.svg`, `logo-gems.svg`).
Keep the same filenames, or update the paths in `SITE_CONFIG`.
PNG works too — just change the extension in `SITE_CONFIG`.

### Photos
Anywhere you see a striped **“Photo”** box, that is a placeholder.
Replace it with `<img src="assets/your-photo.jpg" alt="...">`.

---

## Placeholders ("TBA")

Everything not yet confirmed is wrapped in a yellow dashed **TBA** flag so it
is obvious what still needs real content:

- Application / deadline / allocation dates (conference dates are set: 2–3 October 2026)
- Delegate and school counts
- Committee topics
- Venue, room allocations, delegate fee
- Community (house) names
- Secretariat names beyond the Secretary-General
- Past-conference years and photos

To fill one in, replace `<span class="tba">TBA</span>` (or
`<span class="tba tba--on-purple">TBA</span>` on dark backgrounds) with the
real value.

---

## The application form

The form on `application.html` does **client-side validation only**. On a
valid submit it shows a confirmation card with a generated reference number
and a preview of the confirmation email.

**It does not actually send email.** That needs a backend. The exact spot to
wire one in is marked with a big comment block in `js/site.js` — search for
`BACKEND HOOK — REAL EMAIL SENDING GOES HERE`. Options: a serverless function,
Formspree, EmailJS, or your own API.

---

## Security headers

Every page's `<head>` sets a `Content-Security-Policy` (scripts only from this
site, no inline scripts, styles/fonts limited to this site + Google Fonts) and
a `Referrer-Policy` via `<meta>`, so protection applies regardless of host.

Two extra directives — `frame-ancestors` (clickjacking protection) and
`X-Content-Type-Options` — can only be set as real HTTP response headers, not
`<meta>`. `_headers` sets them automatically on Netlify and Cloudflare Pages;
`.htaccess` does the same on Apache. GitHub Pages doesn't support custom
headers at all, so on GH Pages you get the `<meta>` protections only.

If you ever add a third-party script, embed, or widget, you'll need to add its
domain to the CSP in all six HTML files (and in `_headers` / `.htaccess`) or it
will be silently blocked.

---

## Design system (for reference)

| Token | Value | Use |
|---|---|---|
| Dark purple | `#25143F` | header, footer, banners |
| Accent | `#8B57D6` | links, accents |
| Button | `#E0B80C` | buttons (yellow/gold) |
| Page background | `#FAF7FD` | |
| Body text | `#453A55` | |
| Yellow on purple | `#FFD633` | yellow text on dark backgrounds |
| Yellow on white | `#7D6404` | yellow text on light backgrounds |

Headings: **Bricolage Grotesque**. Body: **Outfit**. Both loaded from Google
Fonts. Sharp 4px corners, 1px light borders. Cards, tiles and buttons carry
a layered resting shadow + a light-source bevel so they read as raised
above the page (not just on hover, which now deepens the shadow further);
form fields and selected/active states use an inset shadow instead, so
they read as pressed in. Tokens for both live at the top of
`css/styles.css` (`--shadow-rest`, `--shadow-hover`, `--bevel`,
`--shadow-press`).

---

## Local preview

No server required — double-click `index.html`.
For a local server (so relative paths behave exactly like production):

```bash
python3 -m http.server 8000
```

then open <http://localhost:8000>.
