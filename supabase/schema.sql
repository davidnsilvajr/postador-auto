-- =============================================
-- POSTADOR AUTO - Supabase Database Schema
-- Run this in your Supabase SQL editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- USERS (extends Supabase auth.users)
-- =============================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  company_name text default '',
  avatar_url text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_profiles_email on profiles(email);

-- =============================================
-- BRANDS
-- =============================================
create table if not exists brands (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  industry text default '',
  website text default '',
  description text default '',
  tone_of_voice text default 'professional',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_brands_user on brands(user_id);

-- =============================================
-- BRAND GUIDELINES
-- =============================================
create table if not exists brand_guidelines (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid references brands(id) on delete cascade not null unique,
  primary_color text default '',
  secondary_color text default '',
  tertiary_color text default '',
  font_family text default 'Inter, system-ui, sans-serif',
  tagline text default '',
  keywords text[] default '{}',
  brand_voice_description text default '',
  do_not_say text[] default '{}',
  must_include text[] default '{}',
  logo_url text default '',
  logo_variants text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_guidelines_brand on brand_guidelines(brand_id);

-- =============================================
-- SOCIAL ACCOUNTS
-- =============================================
create table if not exists social_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  brand_id uuid references brands(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'youtube')),
  access_token text not null,
  refresh_token text default '',
  token_expires_at timestamptz default null,
  page_id text default '',
  username text default '',
  display_name text default '',
  profile_image_url text default '',
  status text default 'active',
  connected_at timestamptz default now(),
  created_at timestamptz default now()
);

create index idx_social_user on social_accounts(user_id);
create index idx_social_brand on social_accounts(brand_id);
create index idx_social_platform on social_accounts(platform);

-- =============================================
-- POSTS
-- =============================================
create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  brand_id uuid references brands(id) on delete cascade not null,
  caption text not null default '',
  platforms text[] not null default '{}',
  media jsonb default '[]',
  hashtags text[] default '{}',
  status text default 'draft' check (status in ('draft', 'pending_approval', 'approved', 'scheduled', 'published', 'failed', 'rejected')),
  campaign text default '',
  notes text default '',
  rejection_reason text default '',
  content_pillar text default '',
  scheduled_at timestamptz default null,
  published_at timestamptz default null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_posts_user on posts(user_id);
create index idx_posts_brand on posts(brand_id);
create index idx_posts_status on posts(status);
create index idx_posts_scheduled_at on posts(scheduled_at);
create index idx_posts_campaign on posts(campaign);

-- =============================================
-- SCHEDULED POSTS
-- =============================================
create table if not exists scheduled_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  platform text not null,
  scheduled_at timestamptz not null,
  timezone text default 'America/Sao_Paulo',
  status text default 'scheduled' check (status in ('scheduled', 'cancelled', 'published', 'failed')),
  published_at timestamptz default null,
  external_post_id text default '',
  error_message text default '',
  created_at timestamptz default now()
);

create index idx_scheduled_status on scheduled_posts(status);
create index idx_scheduled_at on scheduled_posts(scheduled_at);
create index idx_scheduled_post on scheduled_posts(post_id);

-- =============================================
-- POST ANALYTICS
-- =============================================
create table if not exists post_analytics (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id) on delete cascade not null,
  platform text not null,
  brand_id uuid references brands(id) on delete cascade not null,
  likes int default 0,
  comments int default 0,
  shares int default 0,
  impressions int default 0,
  reach int default 0,
  engagement_rate float default 0,
  clicks int default 0,
  saves int default 0,
  collected_at timestamptz default now(),
  created_at timestamptz default now()
);

create index idx_analytics_post on post_analytics(post_id);
create index idx_analytics_brand on post_analytics(brand_id);
create index idx_analytics_platform on post_analytics(platform);

-- =============================================
-- STORAGE BUCKET (brand-assets)
-- Create via Supabase dashboard or:
-- =============================================
-- insert into storage.buckets (id, name, public) values ('brand-assets', 'brand-assets', true);

-- =============================================
-- RLS POLICIES
-- =============================================
alter table profiles enable row level security;
alter table brands enable row level security;
alter table brand_guidelines enable row level security;
alter table social_accounts enable row level security;
alter table posts enable row level security;
alter table scheduled_posts enable row level security;
alter table post_analytics enable row level security;

-- Profiles
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Brands
create policy "Users can view own brands"
  on brands for select using (auth.uid() = user_id);

create policy "Users can create brands"
  on brands for insert with check (auth.uid() = user_id);

create policy "Users can update own brands"
  on brands for update using (auth.uid() = user_id);

create policy "Users can delete own brands"
  on brands for delete using (auth.uid() = user_id);

-- Guidelines
create policy "Anyone can view guidelines"
  on brand_guidelines for select using (true);

create policy "Users can create guidelines"
  on brand_guidelines for insert with check (
    brand_id in (select id from brands where user_id = auth.uid())
  );

create policy "Users can update guidelines"
  on brand_guidelines for update using (
    brand_id in (select id from brands where user_id = auth.uid())
  );

-- Social accounts
create policy "Users can view own social accounts"
  on social_accounts for select using (auth.uid() = user_id);

create policy "Users can create social accounts"
  on social_accounts for insert with check (auth.uid() = user_id);

create policy "Users can update own social accounts"
  on social_accounts for update using (auth.uid() = user_id);

create policy "Users can delete own social accounts"
  on social_accounts for delete using (auth.uid() = user_id);

-- Posts
create policy "Users can view own posts"
  on posts for select using (auth.uid() = user_id);

create policy "Users can create posts"
  on posts for insert with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on posts for update using (auth.uid() = user_id);

create policy "Users can delete own posts"
  on posts for delete using (auth.uid() = user_id);

-- Scheduled posts
create policy "Users can view own scheduled posts"
  on scheduled_posts for select using (auth.uid() = user_id);

create policy "Users can create scheduled posts"
  on scheduled_posts for insert with check (auth.uid() = user_id);

create policy "Users can update own scheduled posts"
  on scheduled_posts for update using (auth.uid() = user_id);

-- Analytics
create policy "Users can view analytics"
  on post_analytics for select using (
    brand_id in (select id from brands where user_id = auth.uid())
  );

-- =============================================
-- STORAGE POLICIES
-- =============================================
insert into storage.buckets (id, name, public, file_size_limit)
values ('brand-assets', 'brand-assets', true, 52428800)
on conflict (id) do nothing;

create policy "Anyone can view brand assets"
  on storage.objects for select
  using (bucket_id = 'brand-assets');

create policy "Users can upload brand assets"
  on storage.objects for insert
  with check (bucket_id = 'brand-assets');

create policy "Users can delete own brand assets"
  on storage.objects for delete
  using (bucket_id = 'brand-assets' and auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure handle_new_user();
