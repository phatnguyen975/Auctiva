create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

create type user_role as enum ('bidder', 'seller', 'admin');
create type seller_request_status as enum ('pending', 'approved', 'rejected');
create type product_status as enum ('active', 'sold', 'expired');
create type bid_status as enum ('valid', 'rejected');

-- BEGIN: Profiles table --
create table if not exists profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text unique not null,
  full_name           text not null,
  address             text,
  birth_date          date,
  avatar_url          text,
  role                user_role default 'bidder',
  rating_positive     int default 0,
  rating_count        int default 0,
  metadata            JSONB,
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
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, address, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'address', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- END: Profiles table --

-- Ratings table
create table if not exists ratings (
  id                  bigserial primary key,
  target_user_id      uuid not null references profiles(id),
  from_user_id        uuid not null references profiles(id),
  score               int not null check (score in (1, -1)),
  comment             text not null,
  created_at          timestamptz default now()
);

-- Seller Upgrade Requests table
create table if not exists seller_upgrade_requests (
  id                  bigserial primary key,
  user_id             uuid not null references profiles(id),
  status              seller_request_status default 'pending',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null
);

-- Categories table
create table if not exists categories (
  id                  bigserial primary key,
  name                text not null,
  parent_id           bigint references categories(id) on delete set null,
  slug                text unique not null,
  created_at          timestamptz default now()
);

alter table categories
add column search_vector tsvector generated always as (
  to_tsvector('english', coalesce(name, ''))
) stored;

create index idx_categories_search on categories using gin(search_vector);

-- Products table
create table if not exists products (
  id                  bigserial primary key,
  seller_id           uuid not null references profiles(id),
  category_id         bigint not null references categories(id) on delete restrict,
  current_winner_id   uuid references profiles(id),
  name                text not null,
  description         text not null,
  slug                text unique not null,
  start_price         numeric not null check (start_price >= 0),
  step_price          numeric not null check (step_price > 0),
  buy_now_price       numeric check (buy_now_price > start_price),
  current_price       numeric,
  post_date           timestamptz not null default now(),
  end_date            timestamptz not null,
  is_auto_extend      boolean not null default true,
  is_instant_purchase boolean not null default false,
  status              product_status default 'active',
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
  id                  bigserial primary key,
  product_id          bigint not null references products(id) on delete cascade,
  url                 text not null,
  is_primary          boolean not null default false,
  created_at          timestamptz default now()
);

-- Bids table
create table if not exists bids (
  id                  bigserial primary key,
  product_id          bigint not null references products(id) on delete cascade,
  bidder_id           uuid not null references profiles(id),
  max_bid             numeric not null,
  status              bid_status default 'valid',
  created_at          timestamptz default now()
);

-- Watchlists table
create table if not exists watchlists (
  user_id             uuid not null references profiles(id),
  product_id          bigint not null references products(id),
  created_at          timestamptz default now(),
  primary key (user_id, product_id)
);
