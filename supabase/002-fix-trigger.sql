-- ─────────────────────────────────────────────────────────────────────────────
--  Sıraya — patch 002. Run this once in Supabase → SQL Editor.
--
--  Fixes two things schema.sql's first version missed:
--   1. Google and GitHub send full_name / name, not display_name. The old
--      trigger ignored both and fell back to the email prefix.
--   2. Anyone who signed up before the trigger existed has no profiles row.
--  Safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────

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
