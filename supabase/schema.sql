-- =============================================================================
-- Skema konten portofolio Arief M. Usry
-- Jalankan sekali di Supabase → SQL Editor, lalu lanjutkan dengan seed.sql.
-- =============================================================================

-- Daftar user yang boleh menulis. Isi manual setelah membuat user di Auth.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Predikat izin tulis, dipakai ulang oleh semua policy.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- ---------------------------------------------------------------- singleton --
create table if not exists public.profile (
  id smallint primary key default 1 check (id = 1),
  name text not null default 'Arief M. Usry',
  badge_en text not null default '',
  badge_id text not null default '',
  hero_title_en text not null default '',
  hero_title_id text not null default '',
  hero_sub_en text not null default '',
  hero_sub_id text not null default '',
  about_en text not null default '',
  about_id text not null default '',
  contact_heading_en text not null default '',
  contact_heading_id text not null default '',
  contact_note_en text not null default '',
  contact_note_id text not null default '',
  photo_path text,
  cv_path text,
  email text not null default '',
  phone text not null default '',
  linkedin text not null default '',
  github text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  show_blog boolean not null default true,
  default_lang text not null default 'EN' check (default_lang in ('EN', 'ID')),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_study (
  id smallint primary key default 1 check (id = 1),
  project_slug text not null default 'indeta',
  heading_en text not null default '',
  heading_id text not null default '',
  -- [{ "label": "ROLE", "value_en": "...", "value_id": "..." }, ...]
  facts jsonb not null default '[]'::jsonb,
  image_paths text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.research (
  id smallint primary key default 1 check (id = 1),
  badge text not null default '',
  title text not null default '',
  body_en text not null default '',
  body_id text not null default '',
  -- [{ "label": "F1-SCORE", "value": "0.5809 → 0.5946" }, ...]
  metrics jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------------- collection --
create table if not exists public.stats (
  id text primary key,
  value text not null default '',
  is_numeric boolean not null default false,
  decimals smallint not null default 0,
  label_en text not null default '',
  label_id text not null default '',
  sort smallint not null default 0
);

create table if not exists public.tracks (
  id text primary key,
  title_en text not null default '',
  title_id text not null default '',
  body_en text not null default '',
  body_id text not null default '',
  chips text[] not null default '{}',
  accent boolean not null default false,
  sort smallint not null default 0
);

create table if not exists public.projects (
  id text primary key,
  slug text not null unique,
  title text not null default '',
  summary_en text not null default '',
  summary_id text not null default '',
  badges text[] not null default '{}',
  accent_badge boolean not null default false,
  tech text[] not null default '{}',
  image_path text,
  github_url text,
  featured boolean not null default false,
  has_thumb boolean not null default true,
  sort smallint not null default 0
);

create table if not exists public.experiences (
  id text primary key,
  period_en text not null default '',
  period_id text not null default '',
  role_en text not null default '',
  role_id text not null default '',
  body_en text not null default '',
  body_id text not null default '',
  sort smallint not null default 0
);

create table if not exists public.skill_groups (
  id text primary key,
  name_en text not null default '',
  name_id text not null default '',
  items text[] not null default '{}',
  accent boolean not null default false,
  sort smallint not null default 0
);

create table if not exists public.posts (
  id text primary key,
  category_en text not null default '',
  category_id text not null default '',
  title_en text not null default '',
  title_id text not null default '',
  published boolean not null default true,
  sort smallint not null default 0
);

-- ---------------------------------------------------------------------- RLS --
-- Baca: terbuka untuk siapa pun (situs publik). Tulis: hanya admin.
do $$
declare
  t text;
begin
  foreach t in array array[
    'profile', 'site_settings', 'case_study', 'research',
    'stats', 'tracks', 'projects', 'experiences', 'skill_groups', 'posts'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t || '_read', t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      t || '_read', t
    );
    execute format('drop policy if exists %I on public.%I', t || '_write', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      t || '_write', t
    );
  end loop;
end $$;

-- Tabel admins: user hanya boleh melihat barisnya sendiri; tidak ada tulis dari klien.
alter table public.admins enable row level security;
drop policy if exists admins_read_self on public.admins;
create policy admins_read_self on public.admins
  for select to authenticated using (user_id = auth.uid());

-- ------------------------------------------------------------------ storage --
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true), ('documents', 'documents', true)
on conflict (id) do update set public = true;

drop policy if exists portfolio_assets_read on storage.objects;
create policy portfolio_assets_read on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('assets', 'documents'));

drop policy if exists portfolio_assets_write on storage.objects;
create policy portfolio_assets_write on storage.objects
  for all to authenticated
  using (bucket_id in ('assets', 'documents') and public.is_admin())
  with check (bucket_id in ('assets', 'documents') and public.is_admin());
