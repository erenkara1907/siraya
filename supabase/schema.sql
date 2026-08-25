-- ─────────────────────────────────────────────────────────────────────────────
--  Sıraya — database schema.
--  Paste this whole file into Supabase → SQL Editor → New query → Run.
--  Safe to re-run: every statement is idempotent.
--
--  Model: a user owns channels; a channel carries posts; a post accumulates
--  metrics. Every table is row-level-secured so a user only ever sees their own.
-- ─────────────────────────────────────────────────────────────────────────────

/* ── Enums ────────────────────────────────────────────────────────────────── */
do $$ begin
  create type platform as enum ('instagram', 'x', 'linkedin', 'tiktok');
exception when duplicate_object then null; end $$;

do $$ begin
  create type post_status as enum ('draft', 'needs_review', 'scheduled', 'published', 'failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type activity_action as enum ('queued', 'approved', 'published', 'shifted_to_best_time', 'failed');
exception when duplicate_object then null; end $$;

/* ── profiles — one row per auth user, created automatically on signup ────── */
create table if not exists profiles (
  id           uuid primary key references auth.users on delete cascade,
  display_name text,
  timezone     text not null default 'Europe/Istanbul',
  created_at   timestamptz not null default now()
);

-- Email+password signup sends display_name; Google and GitHub send full_name or
-- name instead. Take whichever arrived, and fall back to the email local part.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'display_name', ''),
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(new.raw_user_meta_data->>'name', ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Backfill: anyone who signed up before this trigger existed still needs a row.
insert into public.profiles (id, display_name)
select
  u.id,
  coalesce(
    nullif(u.raw_user_meta_data->>'display_name', ''),
    nullif(u.raw_user_meta_data->>'full_name', ''),
    nullif(u.raw_user_meta_data->>'name', ''),
    split_part(u.email, '@', 1)
  )
from auth.users u
on conflict (id) do nothing;

/* ── channels — one connected social account ─────────────────────────────── */
create table if not exists channels (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  platform     platform not null,
  handle       text not null,
  followers    integer not null default 0,
  growth       numeric(5,2) not null default 0,   -- % vs last 30d
  engagement   numeric(5,2) not null default 0,   -- avg %
  is_connected boolean not null default false,
  created_at   timestamptz not null default now(),
  unique (user_id, platform, handle)
);

create index if not exists channels_user_idx on channels (user_id);

/* ── posts — the calendar, the queue and the history are all views of this ── */
create table if not exists posts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  channel_id    uuid references channels on delete set null,
  platform      platform not null,
  title         text not null,
  body          text not null default '',
  media_url     text,
  scheduled_at  timestamptz,                       -- null while it is a loose draft
  published_at  timestamptz,
  status        post_status not null default 'draft',
  is_best_time  boolean not null default false,    -- sitting in a best-time window
  failure_error text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- The scheduler polls this: "what is due?" — keep it a cheap index scan.
create index if not exists posts_due_idx on posts (scheduled_at) where status = 'scheduled';
create index if not exists posts_user_scheduled_idx on posts (user_id, scheduled_at desc);

create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists posts_touch_updated_at on posts;
create trigger posts_touch_updated_at
  before update on posts
  for each row execute function touch_updated_at();

/* ── post_metrics — reach/engagement pulled back from each platform ──────── */
create table if not exists post_metrics (
  id              uuid primary key default gen_random_uuid(),
  post_id         uuid not null references posts on delete cascade,
  user_id         uuid not null references auth.users on delete cascade,
  reach           integer not null default 0,
  impressions     integer not null default 0,
  likes           integer not null default 0,
  comments        integer not null default 0,
  engagement_rate numeric(5,2) not null default 0,
  collected_at    timestamptz not null default now()
);

create index if not exists post_metrics_post_idx on post_metrics (post_id, collected_at desc);

/* ── activity — the dashboard feed ───────────────────────────────────────── */
create table if not exists activity (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  actor      text not null,                 -- 'Sıraya' for automated actions
  action     activity_action not null,
  target     text not null,                 -- 'Instagram · 18:00'
  post_id    uuid references posts on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists activity_user_idx on activity (user_id, created_at desc);

/* ── Row Level Security — a user reaches nothing but their own rows ──────── */
alter table profiles     enable row level security;
alter table channels     enable row level security;
alter table posts        enable row level security;
alter table post_metrics enable row level security;
alter table activity     enable row level security;

drop policy if exists "own profile" on profiles;
create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own channels" on channels;
create policy "own channels" on channels
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own posts" on posts;
create policy "own posts" on posts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own metrics" on post_metrics;
create policy "own metrics" on post_metrics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own activity" on activity;
create policy "own activity" on activity
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
