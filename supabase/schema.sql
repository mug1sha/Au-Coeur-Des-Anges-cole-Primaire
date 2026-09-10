-- ─────────────────────────────────────────────────────────────
-- Au Coeur Des Anges — Supabase SQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- PROFILES (linked to auth.users)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null unique,
  role        text not null check (role in ('super_admin','admin','teacher','accountant','content_manager')),
  avatar      text,
  active      boolean not null default true,
  last_login  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Admins can read all profiles
create policy "Admins can read profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('super_admin','admin')
    )
  );

-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (id = auth.uid());

-- Only super_admin can insert/update/delete profiles
create policy "Super admin manages profiles"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'super_admin'
    )
  );

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'admin')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- ANNOUNCEMENTS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.announcements (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  content      text not null,
  excerpt      text,
  category     text not null default 'general'
               check (category in ('general','academic','event','important','parents')),
  cover_image  text,
  status       text not null default 'draft'
               check (status in ('draft','scheduled','published','archived')),
  published_at timestamptz,
  expires_at   timestamptz,
  pinned       boolean not null default false,
  author       text not null,
  created_by   uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.announcements enable row level security;

-- Public can read published, non-expired announcements
create policy "Public reads published announcements"
  on public.announcements for select
  using (
    status = 'published'
    and (expires_at is null or expires_at > now())
  );

-- Authenticated staff can read all
create policy "Staff reads all announcements"
  on public.announcements for select
  using (auth.uid() is not null);

-- content_manager, admin, super_admin can write
create policy "Staff manages announcements"
  on public.announcements for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('super_admin','admin','content_manager','teacher')
    )
  );

create trigger announcements_updated_at
  before update on public.announcements
  for each row execute function public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────
-- TEACHERS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.teachers (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  position        text not null,
  subject         text not null,
  bio             text,
  qualifications  text[],
  experience      integer,
  email           text not null unique,
  phone           text,
  avatar          text,
  joined_at       date not null default current_date,
  public_visible  boolean not null default true,
  status          text not null default 'active'
                  check (status in ('active','inactive','archived')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.teachers enable row level security;

-- Public can read active, visible teachers
create policy "Public reads visible teachers"
  on public.teachers for select
  using (status = 'active' and public_visible = true);

-- Staff can read all
create policy "Staff reads all teachers"
  on public.teachers for select
  using (auth.uid() is not null);

-- Admin/super_admin manages teachers
create policy "Admin manages teachers"
  on public.teachers for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('super_admin','admin','content_manager')
    )
  );

create trigger teachers_updated_at
  before update on public.teachers
  for each row execute function public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────
-- SERVICES
-- ─────────────────────────────────────────────────────────────
create table if not exists public.services (
  id               uuid primary key default uuid_generate_v4(),
  title            text not null,
  slug             text not null unique,
  description      text not null,
  long_description text,
  icon             text not null default '🏫',
  image            text,
  age_range        text not null,
  price            text,
  schedule         text,
  status           text not null default 'active'
                   check (status in ('active','inactive','archived')),
  "order"          integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.services enable row level security;

-- Public reads active services
create policy "Public reads active services"
  on public.services for select
  using (status = 'active');

-- Staff reads all
create policy "Staff reads all services"
  on public.services for select
  using (auth.uid() is not null);

-- Admin manages services
create policy "Admin manages services"
  on public.services for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('super_admin','admin','content_manager')
    )
  );

create trigger services_updated_at
  before update on public.services
  for each row execute function public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────
-- REVENUES
-- ─────────────────────────────────────────────────────────────
create table if not exists public.revenues (
  id             uuid primary key default uuid_generate_v4(),
  description    text not null,
  amount         numeric(12,2) not null,
  currency       text not null default 'RWF',
  category       text not null default 'autres'
                 check (category in ('frais_scolaires','inscription','cantine','transport','activites','autres')),
  student_name   text,
  reference      text,
  payment_method text not null default 'cash'
                 check (payment_method in ('cash','bank_transfer','mobile_money','check')),
  status         text not null default 'completed'
                 check (status in ('pending','completed','cancelled')),
  date           date not null default current_date,
  notes          text,
  recorded_by    uuid references public.profiles(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.revenues enable row level security;

-- Only accountant/admin can access finance
create policy "Finance staff accesses revenues"
  on public.revenues for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('super_admin','admin','accountant')
    )
  );

create trigger revenues_updated_at
  before update on public.revenues
  for each row execute function public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────
-- EXPENSES
-- ─────────────────────────────────────────────────────────────
create table if not exists public.expenses (
  id             uuid primary key default uuid_generate_v4(),
  description    text not null,
  amount         numeric(12,2) not null,
  currency       text not null default 'RWF',
  category       text not null default 'autres'
                 check (category in ('salaires','fournitures','cantine','infrastructure','electricite','eau','internet','transport','entretien','marketing','autres')),
  vendor         text,
  reference      text,
  payment_method text not null default 'cash'
                 check (payment_method in ('cash','bank_transfer','mobile_money','check')),
  status         text not null default 'completed'
                 check (status in ('pending','completed','cancelled')),
  date           date not null default current_date,
  receipt_url    text,
  notes          text,
  recorded_by    uuid references public.profiles(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.expenses enable row level security;

create policy "Finance staff accesses expenses"
  on public.expenses for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('super_admin','admin','accountant')
    )
  );

create trigger expenses_updated_at
  before update on public.expenses
  for each row execute function public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────
-- AUDIT LOGS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete set null,
  user_name   text not null,
  user_role   text not null,
  action      text not null,
  resource    text not null,
  resource_id text,
  details     text,
  ip_address  text,
  created_at  timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

create policy "Admins read audit logs"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role in ('super_admin','admin')
    )
  );

create policy "System inserts audit logs"
  on public.audit_logs for insert
  with check (auth.uid() is not null);

-- ─────────────────────────────────────────────────────────────
-- SCHOOL SETTINGS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.school_settings (
  id                  uuid primary key default uuid_generate_v4(),
  school_name         text not null default 'Au Coeur Des Anges',
  subtitle            text not null default 'Crèche & Maternelle',
  tagline             text,
  email               text,
  phone               text,
  address             text,
  city                text default 'Kigali',
  country             text default 'Rwanda',
  currency            text default 'RWF',
  academic_year_start text,
  academic_year_end   text,
  opening_time        text default '07:00',
  closing_time        text default '17:30',
  open_days           text[] default array['Lundi','Mardi','Mercredi','Jeudi','Vendredi'],
  whatsapp_number     text,
  instagram_url       text,
  facebook_url        text,
  updated_at          timestamptz not null default now()
);

alter table public.school_settings enable row level security;

-- Anyone can read settings (used on public site)
create policy "Public reads settings"
  on public.school_settings for select
  using (true);

-- Only super_admin can update
create policy "Super admin updates settings"
  on public.school_settings for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'super_admin'
    )
  );

create trigger settings_updated_at
  before update on public.school_settings
  for each row execute function public.handle_updated_at();

-- Insert default settings row
insert into public.school_settings (school_name, subtitle, city, country, currency)
values ('Au Coeur Des Anges', 'Crèche & Maternelle', 'Kigali', 'Rwanda', 'RWF')
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────
-- STORAGE BUCKETS (run separately in Supabase Storage UI
-- or via the storage API — listed here for reference)
-- ─────────────────────────────────────────────────────────────
-- Bucket: "avatars"   → teacher/staff photos (public)
-- Bucket: "gallery"   → gallery images (public)
-- Bucket: "receipts"  → expense receipts (private, staff only)
