# ItalioIndia — multi-domain India travel site

A modern, AI-assisted travel site for India tours, served from four locale-specific domains:

| Locale | Domain (default)         | Env override                  |
|--------|--------------------------|-------------------------------|
| EN     | italioindia.com          | `NEXT_PUBLIC_DOMAIN_EN`       |
| IT     | viaggioindia.com         | `NEXT_PUBLIC_DOMAIN_IT`       |
| DE     | indienreise.de           | `NEXT_PUBLIC_DOMAIN_DE`       |
| FR     | voyage-en-inde.fr        | `NEXT_PUBLIC_DOMAIN_FR`       |

## Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **TypeScript** strict
- **Tailwind CSS 4** with a custom palette (cream / ink / saffron)
- **next-intl v4** with **domain-based** locale routing in production, path-based in dev
- **Supabase Postgres** for everything: tour content (jsonb-localized), destinations, testimonials, journal, and inquiry leads
- **shadcn/ui-style** components on Radix primitives
- **framer-motion** for hero & chat transitions
- **react-hook-form + zod** for the inquiry form
- **Anthropic Claude** (`claude-sonnet-4-6`) for the AI trip designer (streaming)
- **Resend** for inquiry email delivery

Everything is **graceful**: the site runs and looks correct with zero env vars set. As you add credentials, features light up.

## Quick start

```bash
pnpm install
cp .env.example .env.local      # optional but recommended
pnpm dev                        # http://localhost:3001 (or 3000)
```

Open http://localhost:3001 — the **Globe (EN ▾)** in the header switches between EN / IT / DE / FR via path-based URLs.

The site renders fully out of the box with built-in mock content. To turn on the real features:

| Want this | Set these env vars | What unlocks |
|---|---|---|
| AI trip designer chat | `ANTHROPIC_API_KEY` | The bottom-right widget streams Claude responses |
| Inquiry emails | `RESEND_API_KEY`, `INQUIRY_FROM`, `INQUIRY_TO` | Form submissions arrive in your inbox |
| Database-backed content + leads | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Tours / destinations / testimonials served from Postgres; every inquiry saved to `public.leads` |
| 4-domain production routing | `NEXT_PUBLIC_USE_DOMAIN_ROUTING=true` | Locale switcher cross-links to the matching domain |

## Setting up Supabase (5 minutes)

1. **Create a free project** at https://supabase.com/dashboard.
2. **Settings → API** — copy three values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (browser-safe, respects RLS)
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY` (server-only, bypasses RLS)

   Add all three to `.env.local`.
3. **SQL Editor → New query**, then run these three files in order:
   1. [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql) — `leads` table for inquiry submissions
   2. [supabase/migrations/0002_content.sql](supabase/migrations/0002_content.sql) — `tours`, `destinations`, `testimonials`, `journal_posts`
   3. [supabase/seed/tours_seed.sql](supabase/seed/tours_seed.sql) — copies the eight mock tours so the site has content immediately
4. **Restart `pnpm dev`**. The site is now reading content from Postgres. Submit the contact form once and check **Table Editor → leads**.

### Editing content

Three options:
- **Built-in**: Supabase Dashboard → **Table Editor → tours** (or destinations / testimonials). Click any cell to edit. The localized columns (`title`, `summary`, `highlights` etc.) are JSON, so you edit `{"en": "...", "it": "...", "de": "...", "fr": "..."}` directly.
- **SQL**: write `update public.tours set …` if you prefer.
- **Custom admin** (later): say the word and I'll build a `/admin` route inside this app — same look as the rest of the site, with proper forms, locale tabs, image upload to Supabase Storage, and email/password auth.

### Photography

Use Supabase Storage:
1. Storage → New bucket → name it `tour-images`, **Public bucket: yes**.
2. Upload images, copy the public URL.
3. Paste URL into the `hero_image` column or push into the `gallery` text array.

Allowed image hosts are configured in [next.config.ts](next.config.ts) — Unsplash by default, plus your Supabase project URL once `NEXT_PUBLIC_SUPABASE_URL` is set.

## Project layout

```
messages/              en.json, it.json, de.json, fr.json — UI strings
supabase/
  migrations/          SQL files to run in Supabase, in order
  seed/                seed data (mock tours + testimonials)
src/
  app/
    [locale]/          all user-facing pages
    api/
      chat/            Claude streaming endpoint
      inquiry/         writes to Supabase leads table + sends email (both optional)
    sitemap.ts         multi-domain sitemap with hreflang
    robots.ts
  components/
    layout/            header, footer, locale switcher
    sections/          home page sections
    forms/             inquiry-form
    chat/              chat-widget
    ui/                shadcn-style primitives
  i18n/                next-intl routing, request, navigation helpers
  lib/
    tours.ts           types + mock data + Supabase fetchers (graceful fallback)
    tour-display.ts    helpers that resolve text from DB OR i18n keys
    destinations.ts    same pattern
    utils.ts
  supabase/
    public.ts          anon-key client (used by Server Components for reads)
    server.ts          service-role client (server-only, used by /api/inquiry)
    content.ts         content fetchers (tours, destinations, testimonials)
    types.ts           hand-written DB types
  proxy.ts             next-intl middleware (Next 16 renamed middleware → proxy)
```

## Deploying to Vercel (4 domains, one project)

1. **Create one Vercel project** from this repo.
2. **Add four domains** in Project → Settings → Domains. Point them via DNS.
3. **Set environment variables** (Production):
   - `ANTHROPIC_API_KEY`
   - `RESEND_API_KEY`, `INQUIRY_FROM`, `INQUIRY_TO`
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_USE_DOMAIN_ROUTING=true`
   - The four `NEXT_PUBLIC_DOMAIN_*` values
4. **Deploy.**

## Scripts

```bash
pnpm dev          # next dev (turbopack)
pnpm build        # production build
pnpm start        # start production server
pnpm lint         # eslint
pnpm typecheck    # tsc --noEmit
```

## Status

| | Status |
|---|---|
| Build | ✅ clean (60 pages prerendered across 4 locales) |
| Typecheck | ✅ clean |
| EN / IT / DE / FR locale switching | ✅ works on localhost (path-based) and on production domains |
| AI chat widget | ✅ wired (needs `ANTHROPIC_API_KEY`) |
| Inquiry form | ✅ writes to Supabase + emails (each side optional) |
| Postgres content | ✅ schemas + seed shipped — pages read from DB when configured, mock when not |
| Real content | ❌ pending — viaggioindia.com is empty; you provide content (PDF / docs / photos) and we update the seed |
| Photography | ❌ Unsplash placeholders — replace via Supabase Storage |
| Custom admin UI | ❌ deferred — Supabase Table Editor works for now |
| Booking / payments | ❌ out of scope for v1 — current flow is inquiry → designer reply |
```
