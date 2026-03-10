-- Extensions
create extension if not exists "pgcrypto";

-- Users (linked to auth.users)
create table if not exists public.users (
  id uuid primary key,
  email text unique not null,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.users(id),
  name text not null,
  slug text unique not null,
  locale_default text default 'fr-MA',
  currency text default 'MAD',
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.store_members (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','agent')),
  unique (store_id, user_id)
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  price_mad numeric(10,2) not null,
  stock_qty integer default 0,
  is_active boolean default true,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  question text not null,
  answer text not null,
  language text default 'fr',
  tags text[] default '{}',
  priority integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null unique references public.stores(id) on delete cascade,
  policy_summary text,
  delivery_summary text,
  payment_summary text,
  bot_fallback_message text,
  human_handoff_enabled boolean default true,
  updated_at timestamptz default now()
);

create table if not exists public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  city text not null,
  fee_mad numeric(10,2) not null,
  eta_hours integer,
  is_active boolean default true
);

create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  method_code text not null,
  display_name text not null,
  details text,
  is_active boolean default true
);

create table if not exists public.opening_hours (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  opens_at time,
  closes_at time,
  is_closed boolean default false
);

create table if not exists public.channel_accounts (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('web','telegram','instagram','whatsapp')),
  external_account_id text not null,
  display_name text,
  encrypted_tokens jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  unique (provider, external_account_id)
);

create table if not exists public.channel_installations (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  channel_account_id uuid not null references public.channel_accounts(id) on delete cascade,
  settings jsonb default '{}'::jsonb,
  is_active boolean default true,
  unique (store_id, channel_account_id)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  channel text not null check (channel in ('web','telegram','instagram','whatsapp')),
  external_conversation_id text not null,
  external_user_id text not null,
  status text not null default 'open' check (status in ('open','pending_handoff','resolved')),
  last_message_at timestamptz default now(),
  created_at timestamptz default now(),
  unique (store_id, channel, external_conversation_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  direction text not null check (direction in ('inbound','outbound')),
  text text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  name text,
  phone text,
  email text,
  message text not null,
  created_at timestamptz default now()
);

create table if not exists public.human_handoffs (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  reason text not null,
  status text not null default 'pending' check (status in ('pending','assigned','done')),
  assigned_user_id uuid references public.users(id),
  created_at timestamptz default now()
);

create table if not exists public.webhook_events (
  id bigint generated always as identity primary key,
  channel text not null,
  payload jsonb not null,
  created_at timestamptz default now()
);

alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.faqs enable row level security;
alter table public.conversations enable row level security;

create policy if not exists store_member_select_stores on public.stores
for select using (
  exists (
    select 1 from public.store_members sm where sm.store_id = stores.id and sm.user_id = auth.uid()
  )
);
