CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TYPE user_role AS ENUM ('BIDDER', 'SELLER', 'ADMIN');
CREATE TYPE seller_request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE product_status AS ENUM ('ACTIVE', 'SOLD', 'EXPIRED');
CREATE TYPE bid_status AS ENUM ('VALID', 'REJECTED');

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name           TEXT NOT NULL,
    address             TEXT NOT NULL,
    birth_date          DATE,
    avatar_url          TEXT,
    role                user_role NOT NULL DEFAULT 'BIDDER',
    rating_positive     INT DEFAULT 0,
    rating_count        INT DEFAULT 0,
    metadata            JSONB,
    created_at          TIMESTAMPTZ DEFAULT now(),
    updated_at          TIMESTAMPTZ DEFAULT now()
);

-- Ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
    id                  BIGSERIAL PRIMARY KEY,
    target_user_id      UUID NOT NULL REFERENCES public.profiles(id),
    from_user_id        UUID NOT NULL REFERENCES public.profiles(id),
    score               INT NOT NULL CHECK (score IN (1, -1)),
    comment             TEXT NOT NULL,
    created_at          TIMESTAMPTZ DEFAULT now()
);

-- Seller Upgrade Requests table
CREATE TABLE IF NOT EXISTS public.seller_upgrade_requests (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             UUID NOT NULL REFERENCES public.profiles(id),
    status              seller_request_status DEFAULT 'PENDING',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id                  BIGSERIAL PRIMARY KEY,
    name                TEXT NOT NULL,
    parent_id           BIGINT REFERENCES public.categories(id) ON DELETE SET NULL,
    slug                TEXT UNIQUE NOT NULL,
    created_at          TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.categories
ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name, ''))
) STORED;

CREATE INDEX idx_categories_search ON public.categories USING GIN(search_vector);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
    id                  BIGSERIAL PRIMARY KEY,
    seller_id           UUID NOT NULL REFERENCES public.profiles(id),
    category_id         BIGINT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    current_winner_id   UUID REFERENCES public.profiles(id),
    name                TEXT NOT NULL,
    description         TEXT NOT NULL,
    slug                TEXT UNIQUE NOT NULL,
    start_price         NUMERIC NOT NULL CHECK (start_price >= 0),
    step_price          NUMERIC NOT NULL CHECK (step_price > 0),
    buy_now_price       NUMERIC CHECK (buy_now_price > start_price),
    current_price       NUMERIC,
    post_date           TIMESTAMPTZ NOT NULL DEFAULT now(),
    end_date            TIMESTAMPTZ NOT NULL,
    is_auto_extend      BOOLEAN NOT NULL DEFAULT TRUE,
    is_instant_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    status              product_status DEFAULT 'ACTIVE',
    min_images          INT DEFAULT 3,
    created_at          TIMESTAMPTZ DEFAULT now(),
    updated_at          TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.products
ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name,''))
) STORED;

CREATE INDEX idx_products_search ON public.products USING GIN(search_vector);

-- Product Images table
CREATE TABLE IF NOT EXISTS public.product_images (
    id                  BIGSERIAL PRIMARY KEY,
    product_id          BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    url                 TEXT NOT NULL,
    is_primary          BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ DEFAULT now()
);

-- Bids table
CREATE TABLE IF NOT EXISTS public.bids (
    id                  BIGSERIAL PRIMARY KEY,
    product_id          BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    bidder_id           UUID NOT NULL REFERENCES public.profiles(id),
    max_bid             NUMERIC NOT NULL,
    status              bid_status DEFAULT 'VALID',
    created_at          TIMESTAMPTZ DEFAULT now()
);

-- Watchlists table
CREATE TABLE IF NOT EXISTS public.watchlists (
    user_id             UUID NOT NULL REFERENCES public.profiles(id),
    product_id          BIGINT NOT NULL REFERENCES public.products(id),
    created_at          TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, product_id)
);
