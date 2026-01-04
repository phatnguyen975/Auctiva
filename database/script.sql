create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

create type user_role as enum ('bidder', 'seller', 'admin');
create type account_status as enum ('active', 'locked');
create type rating_type as enum ('seller_bidder', 'bidder_seller');
create type seller_request_status as enum ('pending', 'approved', 'rejected');
create type seller_permission_status as enum ('active', 'expired');
create type product_status as enum ('active', 'sold', 'expired');
create type bid_status as enum ('valid', 'rejected');
create type transaction_status as enum ('pending', 'paid', 'shipped', 'completed', 'cancelled');

-- BEGIN: Profiles table --
create table if not exists profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  user_name           text,
  email               text unique not null,
  full_name           text not null,
  address             text,
  birth_date          date,
  avatar_url          text,
  role                user_role not null default 'bidder',
  rating_positive     int default 0,
  rating_count        int default 0,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone" on profiles
  for select using (true);

create policy "Users can insert their own profile" on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile" on profiles
  for update using ((select auth.uid()) = id);

create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, user_name, email, full_name, address, avatar_url)
  values (new.id, new.raw_user_meta_data->>'user_name', new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'address', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
-- END: Profiles table --

-- Seller Upgrade Requests table
create table if not exists seller_upgrade_requests (
  id                  serial primary key,
  user_id             uuid not null references profiles(id),
  status              seller_request_status not null default 'pending',
  requested_at        timestamptz default now(),
  reviewed_at         timestamptz
);

-- Seller Permissions table
create table if not exists seller_permissions (
  id                  serial primary key,
  user_id             uuid not null references profiles(id),
  status              seller_permission_status not null default 'active',
  approved_at         timestamptz default now(),
  expired_at          timestamptz
);

-- Categories table
create table if not exists categories (
  id                  serial primary key,
  name                text not null,
  slug                text unique,
  parent_id           int references categories(id) on delete set null,
  created_at          timestamptz default now()
);

alter table categories
add column search_vector tsvector generated always as (
  to_tsvector('english', coalesce(name, ''))
) stored;

create index idx_categories_search on categories using gin(search_vector);

-- Products table
create table if not exists products (
  id                  serial primary key,
  seller_id           uuid not null references profiles(id),
  category_id         int not null references categories(id),
  winner_id           uuid references profiles(id),
  name                text not null,
  description         text not null,
  slug                text unique,
  start_price         numeric not null check (start_price >= 0),
  step_price          numeric not null check (step_price > 0),
  buy_now_price       numeric check (buy_now_price > start_price),
  current_price       numeric not null,
  post_date           timestamptz not null default now(),
  end_date            timestamptz not null,
  is_auto_extend      boolean not null default true,
  is_instant_purchase boolean not null default false,
  status              product_status not null default 'active',
  min_images          int default 3,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table products
add column search_vector tsvector generated always as (
  to_tsvector('english', coalesce(name,''))
) stored;

create index idx_products_search on products using gin(search_vector);

-- Product Images table
create table if not exists product_images (
  id                  serial primary key,
  product_id          int not null references products(id) on delete cascade,
  url                 text not null,
  is_primary          boolean not null default false,
  created_at          timestamptz default now()
);

-- Ratings table
create table if not exists ratings (
  id                  serial primary key,
  product_id          int not null references products(id)
  target_user_id      uuid not null references profiles(id),
  from_user_id        uuid not null references profiles(id),
  type                rating_type not null,
  score               int not null check (score in (1, -1)),
  comment             text not null,
  created_at          timestamptz default now()
);

-- Bids table
create table if not exists bids (
  id                  serial primary key,
  product_id          int not null references products(id),
  bidder_id           uuid not null references profiles(id),
  max_bid             numeric not null,
  status              bid_status not null default 'valid',
  created_at          timestamptz default now()
);

-- Watchlist table
create table if not exists watchlist (
  user_id             uuid not null references profiles(id),
  product_id          int not null references products(id),
  created_at          timestamptz default now(),
  primary key (user_id, product_id)
);

-- Bid Rejections table
create table if not exists bid_rejections (
  id                  serial primary key,
  product_id          int not null references products(id),
  bidder_id           uuid not null references profiles(id),
  reason              text,
  created_at          timestamptz default now()
);

-- Product Questions table
create table if not exists product_questions (
  id                  serial primary key,
  product_id          int not null references products(id),
  bidder_id           uuid not null references profiles(id),
  question            text not null,
  created_at          timestamptz default now()
);

-- Product Answers table
create table if not exists product_answers (
  id                  serial primary key,
  question_id         int not null references product_questions(id),
  seller_id           uuid not null references profiles(id),
  answer              text not null,
  created_at          timestamptz default now()
);

-- Transactions table
create table if not exists transactions (
  id                  serial primary key,
  product_id          int not null references products(id),
  winner_id           uuid not null references profiles(id),
  seller_id           uuid not null references profiles(id),
  status              transaction_status not null default 'pending',
  shipping_address    text,
  shipping_receipt    text,
  payment_proof       text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- Transaction Messages table
create table if not exists transaction_messages (
  id                  serial primary key,
  transaction_id      int not null references transactions(id),
  sender_id           uuid not null references profiles(id),
  message             text not null,
  created_at          timestamptz default now()
);

-- Admin Settings table
create table if not exists admin_settings (
  key                 text primary key,
  value               jsonb not null,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

insert into admin_settings (key, value)
values
('extend_threshold_minutes', '5'::jsonb),
('auto_extend_minutes', '10'::jsonb),
('highlight_minutes', '30'::jsonb)
