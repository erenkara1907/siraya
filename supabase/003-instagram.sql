-- ─────────────────────────────────────────────────────────────────────────────
--  Sıraya — patch 003. Instagram publishing.
--  Run once in Supabase → SQL Editor. Safe to re-run.
--
--  Adds three things:
--   1. channel_credentials — where OAuth tokens live. RLS is ON with NO policy,
--      so no browser session can ever read a token; only the service role
--      (which bypasses RLS) touches this table, server-side.
--   2. columns tying our rows to Instagram's own ids.
--   3. a public "media" storage bucket — Instagram fetches media from a public
--      URL at publish time, so it cannot live behind auth.
-- ─────────────────────────────────────────────────────────────────────────────

/* ── 1. Credentials — server-only ────────────────────────────────────────── */
create table if not exists channel_credentials (
  channel_id          uuid primary key references channels on delete cascade,
  user_id             uuid not null references auth.users on delete cascade,
  provider            text not null default 'instagram',
  external_account_id text not null,              -- the Instagram user id
  access_token        text not null,              -- long-lived, 60 days
  token_expires_at    timestamptz,
  last_refreshed_at   timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists channel_credentials_user_idx on channel_credentials (user_id);
-- The refresh job asks "what expires soon?" — keep that a cheap scan.
create index if not exists channel_credentials_expiry_idx on channel_credentials (token_expires_at);

drop trigger if exists channel_credentials_touch on channel_credentials;
create trigger channel_credentials_touch
  before update on channel_credentials
  for each row execute function touch_updated_at();

-- RLS on, zero policies: authenticated and anon both get nothing. Deliberate.
alter table channel_credentials enable row level security;

/* ── 2. Instagram's own identifiers on our rows ──────────────────────────── */
alter table channels add column if not exists external_account_id text;
alter table channels add column if not exists username text;

alter table posts add column if not exists external_post_id text;
alter table posts add column if not exists media_type text not null default 'IMAGE';
alter table posts add column if not exists last_attempt_at timestamptz;

/* ── 3. Public media bucket ──────────────────────────────────────────────── */
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Uploads are namespaced by user id: media/<user-id>/<file>. A user may only
-- write inside their own folder; reads are public because Instagram needs them.
drop policy if exists "own media upload" on storage.objects;
create policy "own media upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "own media update" on storage.objects;
create policy "own media update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "own media delete" on storage.objects;
create policy "own media delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "public media read" on storage.objects;
create policy "public media read" on storage.objects
  for select to public
  using (bucket_id = 'media');
