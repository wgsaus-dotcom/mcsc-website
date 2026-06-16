# MCSC Website — Handover Pack

**Multicultural Communities Support Center Inc** — static website, ready to host.

This is a plain HTML/CSS/JS site. No build step, no database, no lock-in. You can
host it anywhere and edit it with any text editor. Everything you need is in this folder.

---

## 1. What's in here

```
index.html          Home
about.html          About us + board
services.html       Our services (incl. confidential family support)
get-involved.html   Volunteer / donate / partner + form
contact.html        Contact + form
assets/
  style.css         All styling (brand colours live at the top)
  main.js           Mobile menu + Quick Exit button
  logo.png          Trimmed logo
  logo.jpeg         Original logo
```

---

## 2. How to put it online (pick one — all free tiers exist)

**Easiest — Netlify Drop:** go to https://app.netlify.com/drop and drag this whole
folder onto the page. You get a live URL in seconds. (Temporary/handover-friendly.)

**Cloudflare Pages / GitHub Pages:** upload the folder to a repo and point the host
at it. No build command needed — it's already static.

**Any web host / cPanel:** upload the folder contents to `public_html`. Done.

The home page must stay named `index.html` so it loads by default.

---

## 3. Before you go live — REPLACE THESE PLACEHOLDERS

Search the files for the yellow-highlighted notes (`class="todo"`) and the word
**confirm**. Each marks something the board must supply or verify:

| Where | What to fix |
|---|---|
| Footer (all pages) | Real **email**, **phone**, and **ABN** |
| `about.html` | Charity/ACNC/PBI/DGR status — only claim what's actually registered |
| `about.html` | Board **roles** (Chair/Secretary/Treasurer/Public Officer) + photos |
| `get-involved.html` | Donation method; only say "tax-deductible" once DGR is granted |
| `services.html` | Confirm family-support wording & helpline numbers with the board |
| `contact.html` / `get-involved.html` | Connect the **forms** (see §4) |

**Important compliance note:** the site currently does **not** claim registered-charity
or DGR (tax-deductible) status, because per the business plan these were not yet
confirmed. Do **not** add those claims until the registrations are actually granted.

---

## 4. Making the contact forms actually send

Right now the two forms show a reminder popup instead of sending — they're inert by
design so nothing breaks at handover. To make them work, use a free form service
(no server needed). Example with **Formspree** (https://formspree.io):

1. Create a free Formspree form; you'll get an endpoint like `https://formspree.io/f/abc123`.
2. In `contact.html` and `get-involved.html`, find the `<form ...>` tag and change:
   - `action="#"` → `action="https://formspree.io/f/abc123"`
   - delete the `onsubmit="alert(...) return false;"` part of that tag.

That's it — submissions arrive in your email.

---

## 5. Editing content & colours

- **Text/links:** open any `.html` file in a text editor and edit the words. The
  page structure is labelled with comments like `<!-- HERO -->`.
- **Brand colours:** open `assets/style.css`. The first block (`:root`) defines every
  colour once (red, orange, gold, green, teal, plum, navy). Change a hex value there
  and it updates everywhere.
- **Logo:** replace `assets/logo.png` with the final logo (keep the same filename).

---

## 6. The "Quick Exit" safety feature

On the Services page, a red **Quick exit** button (and the **Esc** key) instantly
sends the visitor to a neutral website. This is a standard safety feature for pages
that mention family/domestic violence, so someone in an unsafe situation can leave
fast. It currently redirects to the Bureau of Meteorology. Leave it on.

---

## 7. Design notes (for whoever maintains it)

- Palette is taken directly from the logo's dot-art ring.
- Fonts: **Fraunces** (headings) + **Inter** (body), loaded from Google Fonts.
- Fully responsive, keyboard-accessible, and respects reduced-motion settings.
- No tracking or analytics included — add your own if wanted.

---

*Built as a first version from the organisation's business plan and constitution.
Content reflects the business plan, not the earlier marketing-copy draft, which had
omitted several core programs.*
