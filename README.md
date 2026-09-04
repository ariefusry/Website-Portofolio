# Handoff: Arief Muhammad Usry — Portfolio Website

## Overview
A single-page portfolio site for a fullstack software engineer (Flutter/Laravel/Supabase) who is also positioning toward data & ML roles. Sections: header/nav, animated hero, about + "two tracks" (fullstack vs data/ML), selected work grid, a featured case study (INDETA), research highlight (IC2IE 2026 paper), experience timeline, skills, writing/blog teasers, contact footer. Bilingual (EN/ID) via a header toggle.

## About the Design Files
The file in this bundle (`Portfolio.dc.html`) is a **design reference built in HTML** — a high-fidelity prototype of look, content, and hero motion, not production code to copy verbatim. The task is to **recreate this design in a real web stack** (recommend Next.js/React + Tailwind or CSS modules — no existing codebase was connected for this project, so choose what's idiomatic for a personal portfolio: static-generated, deployed on Vercel). Rebuild each section as real components; reimplement the hero animation with `framer-motion` (already the reference implementation) or an equivalent.

To view the reference file: open it in a browser directly, or note it uses a small custom templating runtime (`{{ }}` bindings) that is NOT meant to be reused — treat it as a rendered mock, read the computed styles/structure, not the templating syntax.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and the hero animation choreography are final. Recreate pixel-close using the codebase's own component patterns; exact `oklch()`/hex values and font stacks are given below.

## Screens / Views
Single page, one long scroll. Sections in order:

### 1. Header (sticky)
- Flex row, `justify-content: space-between`, padding `18px 48px`, background `rgba(255,255,255,.7)` with `border-bottom: 1px solid rgba(0,0,0,.08)`, `position: sticky; top:0`.
- Left: logo text "Arief M. Usry", Instrument Sans 600 15px.
- Right: nav links (About, Work, Research, Experience, Writing) in Manrope 500 13px color `#5b6570`, a two-state EN/ID pill toggle, and a solid "Hire me" pill button (`#14171a` bg, white text, `border-radius:999px`, padding `8px 15px`).

### 2. Hero (animated — see Interactions below)
- Grid `1.35fr .8fr`, gap 56px, padding `84px 48px 68px`, `position:relative; overflow:hidden`.
- Decorative radial-gradient glow blob, absolutely positioned top:-140px left:-90px, 520×520px circle, `oklch(0.88 0.08 45 / .55)` fading to transparent, animates in and drifts continuously.
- Left column:
  - Status badge pill: `oklch(0.93 0.05 45)` bg, `oklch(0.42 0.09 45)` text, JetBrains Mono 600 11.5px, `white-space:nowrap`, small pulsing dot (`oklch(0.62 0.14 45)`, 6px circle).
  - Badge text — EN: "OPEN TO ROLES — FULLSTACK · DATA · ML" / ID: "TERBUKA UNTUK — FULLSTACK · DATA · ML"
  - H1, Instrument Sans 600 60px/1.04, letter-spacing -.035em, max-width 640px — EN: "Fullstack engineer, with a second track in data and machine learning." / ID: "Fullstack engineer, dengan jalur kedua di data dan machine learning."
  - Subhead, Manrope 400 17px/1.65, color `#4a545f`, max-width 520px — EN: "Flutter, Laravel and Supabase in production. Two paid client platforms live, an internship at PT Pos Indonesia, and a thesis accepted at IC2IE 2026."
  - Two buttons: primary solid (`#14171a` bg / white text) "View selected work"; secondary outline (`1px solid rgba(0,0,0,.16)`) "Download CV (PDF)". Both `border-radius:8px`, padding `13px 22px`, lift `translateY(-2px)` on hover.
- Right column: profile photo placeholder, 360px tall, `border-radius:12px`, dashed-diagonal placeholder fill — **replace with a real photo, 4:5-ish crop**.

### 3. Stat strip
- 4-column grid, white background, borders top/bottom `rgba(0,0,0,.09)`, dividers between cells `border-right`.
- Big number (Instrument Sans 600 28px) + label (Manrope 500 12px, `#6b757f`) per cell: "2 — Paid client platforms shipped", "3.77 — GPA / 4.00 — Telkom University", "IC2IE 2026 — Paper accepted, IC2IE 2026", "6 — projects 2024—2026". First and second and fourth numbers count up from 0 on load (see Interactions).

### 4. About + Two tracks
- Grid `200px 1fr` gap 48px. Left: eyebrow label "ABOUT / TENTANG" (JetBrains Mono 600 12px, `#8b949c`).
- Right: paragraph (Manrope 400 17.5px/1.7, `#2b333b`, max-width 700px) — bio text (see Design Tokens/Copy below).
- "Two tracks" label, then 2-col card grid (gap 16px, max-width 760px):
  - Card 1 "Fullstack engineering" — white bg, border `rgba(0,0,0,.09)`, body copy + tag chips: Flutter, Laravel, Supabase, PostgreSQL.
  - Card 2 "Data & machine learning" — border `oklch(0.88 0.05 45)`, body copy + tag chips: TensorFlow, Scikit-learn, Pandas, RDKit (chip bg `oklch(0.95 0.03 45)`).

### 5. Selected work
- White bg, header row: "Selected work" (Instrument Sans 600 30px) + "2024 — 2026" label.
- 2-col grid, gap 20px:
  - **Featured project (spans both columns)**: INDETA — split into image placeholder (left) + text panel (right). Tags "PAID CLIENT" (accent pill) + "SOLO FULLSTACK" (neutral pill). Title "INDETA", body: "Tourism & UMKM platform: destinations, products, UMKM directories, travel packages, plus an admin dashboard. Schema design through deployment." Tech chips: Laravel, Tailwind, Vite, Vercel. Links: "Read case study" (underlined) + "GitHub ↗".
  - 4 smaller cards: SUGIH (kretek brand company profile, Laravel+Supabase), Meeting Room Management (PT Pos Indonesia, Flutter+Supabase real-time reservations), AUTENTIK (certificate verification, Mantranet infra), FlexiTask (to-do app + Llama chatbot).

### 6. Case study — INDETA (dark section)
- Background `#14171a`, text `#f2f4f6`. Eyebrow "Read case study — INDETA" in accent color `oklch(0.72 0.11 45)`.
- 2-col grid: left = H2 "Built solo. Paid for. Live on Vercel." + a 2×2 mini-grid of labeled facts (ROLE: Sole fullstack developer / SCOPE: Public site + admin CMS / STACK: Laravel · Tailwind · Vite / OUTCOME: Delivered and deployed), each in a bordered box (`rgba(255,255,255,.14)` border). Right = one large screenshot placeholder + two smaller ones below.

### 7. Research — IC2IE 2026
- White bg, grid `200px 1fr`, eyebrow "RESEARCH / RISET".
- Accent pill "ACCEPTED — IC2IE 2026" (`oklch(0.62 0.14 45)` bg, white text).
- Title: "Prediction of ER-LBD Toxicity using an ANN Optimized by Grey Wolf Optimizer" (Instrument Sans 600 24px).
- Body: dataset/methodology description (Tox21, 8,751 compounds, 18.6:1 imbalance, Morgan fingerprints + physicochemical descriptors → 500 features via Mutual Information; SMOTETomek only within training split).
- Right column: metric rows (label left, value right, divider lines): F1-SCORE 0.5809 → 0.5946 · FALSE POSITIVES 37 → 22 · ARCHITECTURE 54-32-128 · FEATURES 500 via MI.

### 8. Experience
- Grid `200px 1fr`, eyebrow "EXPERIENCE / PENGALAMAN". Each row: `150px 1fr` sub-grid — date range (JetBrains Mono, `#6b757f`) | role title (Instrument Sans 600 18px) + description (Manrope 400 14.5px/1.65, `#4a545f`, max-width 640px). Rows separated by `border-top: 1px solid rgba(0,0,0,.09)`.
  1. Jun–Sep 2025 — Fullstack Developer, Intern, PT Pos Indonesia (Persero)
  2. Feb 2025–Jan 2026 — Operating System Lab Assistant, Telkom University
  3. Jun–Sep 2024 — Evaluation Team, PKKMB 2024 Committee

### 9. Skills & tools
- Grid `200px 1fr`, eyebrow "SKILLS & TOOLS". Three labeled chip groups: Engineering (Flutter, Dart, Laravel, PHP, Supabase, PostgreSQL, MySQL, REST API, Golang, Git, Linux — neutral chips `#f2f4f6`), Data & machine learning (Python, TensorFlow/Keras, Scikit-learn, Pandas, NumPy, RDKit, NiaPy — accent-tinted chips `oklch(0.95 0.03 45)`), Tools (Figma, VS Code, Android Studio, Vercel, Jupyter, Claude Code, Cursor, Copilot — neutral chips).

### 10. Writing (optional — toggled by `showBlog` prop in the reference)
- 3-col grid of draft-post teaser cards, each with a category label + title only (no body copy, no dates — these are unpublished drafts).

### 11. Contact footer (dark section)
- Background `#14171a`, text `#f2f4f6`. Flex row, space-between, wraps on narrow widths.
- Left: H2 "Open to fullstack, data and ML roles." (Instrument Sans 600 40px) + "Bekasi, Indonesia · available immediately".
- Right: stacked contact lines in JetBrains Mono 500 14px — ariefusry0@gmail.com (full brightness), +62 858-1300-5651, linkedin.com/in/ariefusry, github.com/ariefusry (all three in `#b3bcc4`).

## Interactions & Behavior

### Hero entrance animation (Framer Motion)
Runs once on mount (or on nav to the page). Sequence, all with ease `[0.16, 1, 0.3, 1]` unless noted:
1. Glow blob: fades in + scales 0.8→1 over 1.6s (easeOut), then loops a slow drift (`x: 0→26→0, y: 0→-18→0` over 14s, easeInOut, infinite).
2. Status badge: opacity 0→1, y 14→0, duration 0.6s, delay 0.05s.
3. Badge dot: infinite pulse — scale 1→1.65→1, opacity 1→0.45→1, 1.8s loop, easeInOut, starts at 0.8s.
4. H1: **word-by-word reveal**. Each word is wrapped in its own `overflow:hidden` mask span; the inner word slides up from `y: 105%` to `0%` while fading in, staggered 45ms apart, starting at 0.18s, 0.85s duration each.
5. Subhead: opacity 0→1, y 16→0, 0.7s, delay 0.55s.
6. CTA button row: opacity 0→1, y 16→0, 0.7s, delay 0.68s.
7. Photo placeholder: opacity 0→1, y 28→0, scale 0.97→1, 1s, delay 0.3s.
8. Stat strip cells: opacity 0→1, y 18→0, staggered 80ms apart, starting at 0.85s.
9. Simultaneously, three stat numbers count up from 0 to their final value (2, 3.77, 6) over 1.1s starting at 0.95s, easeOut, driven by an animation-frame callback updating the displayed text each tick (2 and 6 shown as integers, 3.77 shown to 2 decimal places).

Implementation note: the reference waits for the `framer-motion` UMD global (`window.Motion`) to be available before starting, and no-ops (shows everything at full opacity, no count-up) if the library fails to load — replicate this as a graceful fallback (respect `prefers-reduced-motion` by skipping motion and showing the end state immediately).

### Language toggle
- EN/ID pill switch in the header (and mirrored on mobile) swaps all copy on the page instantly (no transition) via a small string dictionary keyed by section. Persist the choice is optional — the reference does not persist it across reloads.

### Hover states
- CTA buttons lift `translateY(-2px)` on hover (add a transition, ~0.18s ease).
- "Read case study" link has a static underline (`border-bottom: 1px solid currentColor`) — no special hover needed beyond browser default or a subtle color shift.

### Responsive behavior
Not implemented in the reference (desktop-only mock). Recommend: stack the two-column sections (hero, about, case study, research) to a single column under ~900px; the stat strip and skills chips should wrap naturally; hero H1 should scale down via clamp() on mobile widths.

## State Management
- `lang: "EN" | "ID"` — drives all copy; toggle via header control.
- `heroAnimation: boolean` — dev/user escape hatch to disable the hero motion entirely (maps to a "reduced motion" style preference in production).
- `showBlog: boolean` — toggles visibility of the Writing section (useful while there are no published posts yet).
- Hero animation runs once per mount; no persisted "seen" state — replaying it on every page load is intended.

## Design Tokens

**Colors**
- Background (page): `#f2f4f6`
- Surface / cards: `#ffffff`
- Ink (primary text): `#14171a`
- Body text: `#2b333b` (about paragraph), `#4a545f` (secondary body copy)
- Muted text / eyebrows: `#6b757f`, `#8b949c`
- Dark sections (case study, footer): background `#14171a`, text `#f2f4f6`, secondary text `#b3bcc4`
- Accent (amber/clay): base hue `oklch(_ _ 45)` — badge bg `oklch(0.93 0.05 45)`, badge text `oklch(0.42 0.09 45)`, dot/pill solid `oklch(0.62 0.14 45)`, light chip tint `oklch(0.95 0.03 45)`, card border tint `oklch(0.88 0.05 45)`, dark-section accent text `oklch(0.72 0.11 45)`
- Hairline borders: `rgba(0,0,0,.08)` – `rgba(0,0,0,.12)` on light; `rgba(255,255,255,.14)` on dark

**Typography**
- Display / headings / buttons: **Instrument Sans** (weights 400/500/600/700)
- Body / UI text: **Manrope** (400/500/600/700)
- Labels, eyebrows, stats, code-like values: **JetBrains Mono** (400/500)
- Load via Google Fonts (`Instrument+Sans`, `Manrope`, `JetBrains+Mono`).
- Scale used: H1 60px/1.04 (letter-spacing -.035em) · H2 30–40px/1.1 · body 17–17.5px/1.65–1.7 · secondary body 14–15px/1.6–1.65 · eyebrow/mono labels 11–12px, uppercase-style tracking implied by mono face (not text-transform).

**Spacing / radius**
- Section horizontal padding: 48px (desktop)
- Section vertical padding: 52–84px depending on section weight
- Card radius: 12–14px; pill/button radius: 8px (buttons), 999px (pills/badges)
- Grid gaps: 16–56px depending on density

**Motion**
- Primary ease curve: cubic-bezier(0.16, 1, 0.3, 1)
- Standard entrance duration: 0.6–1s
- Stagger: 45ms (headline words), 80ms (stat cards)

## Assets
- No real photos or screenshots supplied yet — hero portrait and all project screenshots (INDETA public site, INDETA admin dashboard) are dashed-diagonal placeholders in the reference. **Get these from the client before or during development**: a profile photo (roughly 4:5 crop) and screenshots of the INDETA platform (public site + admin dashboard).
- CV PDF: the "Download CV (PDF)" button has no real file wired up — link it to an actual hosted PDF of the CV.
- No icon set or logo files are used beyond text wordmarks.

## Files
- `Portfolio.dc.html` — the full design reference described above (open directly in a browser to view/interact with the hero animation and language toggle).
