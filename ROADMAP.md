# LogbookWrapped Roadmap

*Last updated: 2026-05-12* 
*Current Version: v1.0.8*

## Overview
This document tracks planned improvements, enhancements, and maintenance.

## Release Roadmap

### Release v1.0.9
- CFI / Instructor mode: detect dual given in logbook and surface an optional view that leads with dual given / students / endorsements.
- Dual given vs. dual received breakdown (copy-level, not new card) if CFI mode. Maybe just put it on the stats card IF dual given are present?
- Add a link shortern for share links

### Release v1.1.0: Pilot Pages (detailed)

The v1.0.5 hash link ships shareable snapshots quickly but has two limitations: the URL is 1–2K characters long, and it cannot render OG social preview cards (hash fragments are invisible to servers). v1.1.0 solves both with server-hosted pilot pages under claimable handles, while keeping the app account-free.

#### User-facing flow

1. Pilot finishes their wrapped → "Create My Pilot Page" button.
2. Modal collects:
   - Handle (e.g. `maverick`): validated client-side + server-side for collisions, reserved words, length 3–30, `[a-z0-9_-]` only.
   - Email address: optional; if omitted, page still goes live but no annual reminder.
3. Page goes live immediately at `/pilot/:handle`.
4. If email was provided, SES sends a magic confirmation link. Clicking it:
   - Flips `email_confirmed = true`.
   - Schedules the annual reminder (≈11 months out, give or take a 30-day jitter).
   - Unlocks page-management features (update year-over-year, delete page).
5. ≈12 months later SES sends the reminder: *"Your 2026 LogbookWrapped is live. Upload your 2027 logbook to add a new year."* The link deep-links back into the upload flow pre-filtered to the next calendar year.
6. After the pilot uploads next year's data, the `/pilot/:handle` page grows a year switcher so viewers can toggle `2026 | 2027 | 2028`.

#### Backend (extends existing Express + Postgres + helmet + rate-limit stack)

New DB table:
```
pilot_pages
  id                  SERIAL PRIMARY KEY
  handle              TEXT UNIQUE NOT NULL          -- lowercased, [a-z0-9_-]{3,30}
  email               TEXT                          -- nullable; sha256'd server-side if we ever log
  email_confirmed     BOOLEAN NOT NULL DEFAULT FALSE
  confirm_token       TEXT                          -- single-use, 24h TTL
  manage_token        TEXT NOT NULL                 -- long-lived secret stored in the magic link
  years               JSONB NOT NULL                -- { "2026": { stats: {...} }, "2027": {...} }
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
  reminder_sent_at    TIMESTAMPTZ
  last_view_at        TIMESTAMPTZ
  view_count          INT NOT NULL DEFAULT 0
```

Reserved handles: `admin`, `api`, `pilot`, `wrapped`, `upload`, `growth`, `about`, `contact`, `privacy`, `disclaimer`, `methodology`, `share`, `demo`, `demos`, `dev`, `faq`, `home`, `login`, `logout`, `account`, `settings`, plus the app's existing routes.

New endpoints:
- `POST /api/pilot`: `{ handle, email?, year, stats }` → validates, checks collision, inserts row, returns `{ handle, manage_url }`. Sends SES confirmation if email supplied. Rate-limited to 3/day/IP.
- `GET /api/pilot/:handle`: public read; increments `view_count`, updates `last_view_at`. Returns `{ handle, years: { "2026": {...} } }` with only the stats object per year (no email, no tokens). Caching header `Cache-Control: public, max-age=300`.
- `POST /api/pilot/:handle/year`: requires `?token=<manage_token>`; adds a new year to the `years` JSONB. Validates that the submitted year isn't already present.
- `GET /api/confirm/:confirm_token`: flips `email_confirmed`, nulls the token, schedules reminder. Returns a small HTML page.
- `DELETE /api/pilot/:handle`: requires `?token=<manage_token>`; hard-deletes the row. Also fired via "Delete my page" link in every SES email.

SES templates (2):
- `pilot-page-confirm`: "Confirm your email to unlock annual reminders." CTA → `/api/confirm/:token`.
- `pilot-page-yearly-reminder`: "Your 2026 Wrapped is still live. Time for 2027?" CTA → `/?source=reminder&add_year=2027`.

A daily cron job (`node backend/src/cron/sendReminders.js`) selects rows where `email_confirmed = TRUE AND reminder_sent_at IS NULL AND created_at < NOW() - INTERVAL '11 months'`, sends SES, and stamps `reminder_sent_at`.

#### Frontend

New route `/pilot/:handle` → `PilotPageView.tsx`:
- Fetches `GET /api/pilot/:handle` on mount.
- Hydrates `useLogbookStore` with the stats for the selected year.
- Renders `StoryContainer` in read-only mode (same as v1.0.5 shared view).
- Adds a year-picker chip row when `Object.keys(years).length > 1`.
- OG meta tags via `react-helmet-async`:
  ```
  <meta property="og:title" content="{handle}'s 2026 LogbookWrapped" />
  <meta property="og:description" content="287 hrs · 184 flights · 39 airports · 12,400 NM" />
  <meta property="og:image" content="/api/pilot/:handle/og-image.png" />
  ```
- Server-side OG image generation: add `GET /api/pilot/:handle/og-image.png` that renders a 1200×630 PNG with the pilot's headline stats. Puppeteer or `@vercel/og` style renderer. Cached per year for 24h.

New component `PilotPageCreateModal.tsx`:
- Replaces (or augments) the v1.0.5 `ShareLinkModal`.
- Fields: handle input (with real-time availability check via `HEAD /api/pilot/:handle`), optional email, consent checkbox.
- Data preview card (same pattern as Page 10 `ShieldCheck` block) shows exactly the fields being stored.
- Submit calls `POST /api/pilot` → on success, shows the live URL + copy-to-clipboard + "We sent a confirmation link to your email" state.

Navbar / footer link: a small "My Pilot Page" entry surfaces when `localStorage.pilotPageHandle` is present (set at creation time) so users can find their own page later from any device where they're still logged into the same browser.

#### Privacy + security commitments

- No raw flight records are ever stored server-side. Only aggregated `CalculatedStats` (same schema as `community_stats`, minus `mapData.nodes` which is kept because it's coordinates only).
- No pilot name stored. Handle is user-chosen and can be pseudonymous.
- Emails are stored in plaintext for SES dispatch; hashed if we ever need them in analytics joins. Never shared, never sold.
- 18-month TTL: `reminder_sent_at + 6 months` without any login → auto-delete. Users who confirm the reminder extend the TTL by another 12 months.
- Every SES email includes a one-click "Delete my page forever" link (uses `manage_token`).
- Privacy policy (`Privacy.tsx`) gets a new "Pilot Pages" section enumerating the fields stored and the retention rules.

#### Migration from v1.0.5 hash links

v1.0.5 hash URLs (`/s#...`) remain permanently supported; they cost nothing to maintain since they're decoded client-side. Users with a v1.0.5 link can visit it, click "Claim this as a Pilot Page" in the viewer-mode CTA, and upgrade to `/pilot/:handle` without re-uploading their CSV.

### Reddit Questions
- Add Page 10 Milestones Analyze Checkrides? 
- Extreme Page rework because of pattern work

### Release v2.0.0
- Offline PWA
