# Portfolio — Arief M. Usry

A personal portfolio site: Next.js App Router, content editable through a
Supabase-backed `/admin` dashboard, and it still renders in full when Supabase
is unreachable.

**Live:** https://ariefusry.vercel.app

---

## What sets it apart from a template portfolio

- **Content lives in a database, not in the code.** Profile, projects,
  experience, research, stats and the skill lists are all Supabase rows, editable
  from `/admin` without a redeploy. Public pages use 60-second ISR, so an edit is
  live within a minute.
- **Supabase is never a single point of failure.** `getContent()` tries the
  database first; if the env vars are missing or the query fails, the page falls
  back to `src/lib/seed.ts` and still renders whole. Clone this repo and run
  `npm run dev` with no `.env.local` at all — the site works.
- **Two languages, no duplicated routes.** EN/ID is swapped on the client through
  `lang-context`; every text field is stored as a pair (`*_en` / `*_id`) in the
  database.
- **Light/dark with no flash.** A small script in `<head>` sets `data-theme`
  before React hydrates, so no frame is ever painted in the wrong theme.
- **Authorization is enforced in the database.** Writes are allowed only for
  users listed in the `admins` table, through RLS — not merely hidden in the UI.
  Only the `anon` key is used; there is no `service_role` key in this project.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, CSS custom properties for theme tokens |
| Motion | Framer Motion, CSS keyframes (skills marquee), View Transitions |
| Backend | Supabase — Postgres, Auth, Storage, RLS |
| Icons | simple-icons (brand marks), lucide-react |
| Analytics | Vercel Web Analytics |
| Hosting | Vercel |

## Features

**Public site**

- Hero, About, Two tracks, Featured Build, project grid, project detail pages
  (`/projects/[slug]`) and a paginated index (`/projects`)
- Research section with paper metrics
- Skills reel: one moving row per group, alternating direction, paused on hover
  or when anything inside takes focus, and switchable to the full list with a
  single button. `prefers-reduced-motion` gets the full list straight away rather
  than an animation that is started and then turned off.
- Technology chips render as brand marks when the name is recognised and fall
  back to text chips otherwise — see `src/components/ui/TechIcons.tsx`
- Visitor counter in the footer, dynamic OG image, `sitemap.ts`, `robots.ts`

**`/admin` dashboard**

- Generic CRUD over every content table, driven by one schema declaration in
  `src/lib/admin/schema.ts` — adding a field is one line there
- Asset and CV uploads to Storage, with an image cropper for the profile photo
  and project screenshots
- Login protected by hCaptcha (Supabase Attack Protection is on)

## Structure

```
src/app/                 public pages, admin, sitemap/robots/OG image
src/app/admin/(dash)/    dashboard: [table] → [id], assets
src/components/site/     public site sections
src/components/admin/    dashboard forms and asset manager
src/components/ui/       shared primitives (Reveal, SmartImage, TechIcons, …)
src/lib/seed.ts          fallback content — the source for supabase/seed.sql
src/lib/content.ts       Supabase → seed fallback
src/lib/supabase/        browser/server clients + DB row mapping
src/lib/admin/           form schema + Server Actions
src/proxy.ts             refreshes the Supabase session, guards /admin
supabase/schema.sql      tables, is_admin() function, RLS policies, Storage buckets
supabase/seed.sql        initial content, safe to re-run
```

Content tables: `profile`, `site_settings`, `tracks`, `stats`, `projects`,
`experiences`, `research`, `skill_groups`, `site_metrics`.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without `.env.local` the pages render seed content
and `/admin` redirects home.

To switch the Supabase side on:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_HCAPTCHA_SITEKEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Then run `supabase/schema.sql` and `supabase/seed.sql` in the Supabase SQL
Editor and register an admin user in the `admins` table. The full walkthrough —
including asset uploads and the Vercel deploy — is in [SETUP.md](SETUP.md).

Env vars are read at start-up only, so restart `npm run dev` after changing them.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | development server |
| `npm run build` | production build |
| `npm start` | serve the build |
| `npm run lint` | ESLint |

## Security

- CSP, HSTS, nosniff, frame-deny, Referrer-Policy and Permissions-Policy headers
  are set in `next.config.ts`. The CSP allows only the Supabase, hCaptcha and
  Vercel Analytics origins — adding a third-party service means adding its origin
  there first.
- Every write goes through the user session plus RLS; the writable columns are
  whitelisted in `src/lib/admin/schema.ts`.
- `/admin` is disallowed in `robots.txt` and `noindex` via metadata.

## Note

Code comments and the setup guide in this repo are written in Indonesian; the
site itself is bilingual, with English as the default.
