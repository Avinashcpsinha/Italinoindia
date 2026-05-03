-- Run this in your Supabase project's SQL editor (Database → SQL Editor → New query).

-- Status of an inquiry as it moves through the sales pipeline.
create type public.lead_status as enum ('new', 'in_progress', 'quoted', 'won', 'lost');

create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  status        public.lead_status not null default 'new',
  locale        text not null,
  name          text not null,
  email         text not null,
  phone         text,
  travelers     int,
  duration_days int,
  travel_month  text,
  interests     text[] not null default '{}',
  budget        text,
  message       text,
  tour_slug     text,
  source        text,                       -- e.g. 'inquiry-form', 'chat-widget'
  utm           jsonb                       -- utm_source, utm_medium, ...
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status);
create index leads_email_idx on public.leads (lower(email));

-- Lock down RLS: by default no one can read.
alter table public.leads enable row level security;

-- Server-side inserts use the service-role key, which bypasses RLS — no insert policy needed.
-- Add SELECT policies later when you build the admin dashboard
-- (e.g. allow only authenticated admins, scoped to a tenant).
