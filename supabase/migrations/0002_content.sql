-- Content tables: tours, destinations, testimonials, journal posts.
-- All localized text is stored as jsonb of shape {"en": "...", "it": "...", "de": "...", "fr": "..."}.
-- Run this AFTER 0001_init.sql in the Supabase SQL editor.

-- ---------- DESTINATIONS ----------
create table public.destinations (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          jsonb not null,                       -- {en, it, de, fr}
  region        text not null check (region in ('north','south','east','west','himalaya')),
  intro         jsonb,                                -- short paragraph
  body          jsonb,                                -- long-form (markdown)
  hero_image    text,                                 -- public URL
  display_order int not null default 100,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index destinations_order_idx on public.destinations (display_order);

-- ---------- TOURS ----------
create table public.tours (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  category        text not null check (category in (
    'golden-triangle','rajasthan','kerala','himalaya','south-india','spiritual','wildlife'
  )),
  title           jsonb not null,                    -- {en, it, de, fr}
  summary         jsonb,                             -- short card subtitle
  description     jsonb,                             -- long markdown
  duration_days   int not null check (duration_days between 1 and 60),
  price_from_eur  int not null check (price_from_eur >= 0),
  hero_image      text,                              -- public URL
  gallery         text[] not null default '{}',      -- list of public URLs
  -- Array of {slug, name:{en,it,de,fr}}. Cities not in the destinations table can be embedded directly.
  destinations    jsonb not null default '[]'::jsonb,
  highlights      jsonb not null default '[]'::jsonb, -- array of {en,it,de,fr}
  -- Array of {day:int, title:{en,it,de,fr}, body:{en,it,de,fr}}
  itinerary       jsonb not null default '[]'::jsonb,
  rating          numeric(3,2) check (rating between 0 and 5),
  review_count    int default 0,
  featured        boolean not null default false,
  display_order   int not null default 100,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index tours_featured_idx on public.tours (featured) where featured = true;
create index tours_order_idx on public.tours (display_order, duration_days);

-- ---------- TESTIMONIALS ----------
create table public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  author        text not null,
  trip          jsonb,                                -- {en,it,de,fr}
  quote         jsonb not null,                       -- {en,it,de,fr}
  rating        int not null default 5 check (rating between 1 and 5),
  featured      boolean not null default false,
  display_order int not null default 100,
  created_at    timestamptz not null default now()
);

-- ---------- JOURNAL POSTS ----------
create table public.journal_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         jsonb not null,
  excerpt       jsonb,
  body          jsonb,
  cover_image   text,
  author        text,
  published_at  timestamptz,
  created_at    timestamptz not null default now()
);
create index journal_published_idx on public.journal_posts (published_at desc);

-- ---------- updated_at triggers ----------
create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger destinations_updated_at before update on public.destinations
  for each row execute procedure public.set_updated_at();
create trigger tours_updated_at before update on public.tours
  for each row execute procedure public.set_updated_at();

-- ---------- ROW-LEVEL SECURITY ----------
-- Content is public-readable (the website needs to fetch it from the browser too if you ever do that).
-- Writes are restricted to the service-role key (used in server API routes only).
alter table public.destinations  enable row level security;
alter table public.tours         enable row level security;
alter table public.testimonials  enable row level security;
alter table public.journal_posts enable row level security;

-- "anon" and "authenticated" can read.
create policy "destinations readable" on public.destinations  for select using (true);
create policy "tours readable"        on public.tours         for select using (true);
create policy "testimonials readable" on public.testimonials  for select using (true);
create policy "journal readable"      on public.journal_posts for select
  using (published_at is not null and published_at <= now());

-- Service-role bypasses RLS, so writes from server code work without an explicit policy.
