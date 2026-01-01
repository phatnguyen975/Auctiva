-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('bidder', 'seller', 'admin');

-- CreateEnum
CREATE TYPE "account_status" AS ENUM ('active', 'locked');

-- CreateEnum
CREATE TYPE "seller_request_status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "seller_permission_status" AS ENUM ('active', 'expired');

-- CreateEnum
CREATE TYPE "product_status" AS ENUM ('active', 'sold', 'expired');

-- CreateEnum
CREATE TYPE "bid_status" AS ENUM ('valid', 'rejected');

-- CreateEnum
CREATE TYPE "transaction_status" AS ENUM ('pending', 'paid', 'shipped', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "user_name" TEXT,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "address" TEXT,
    "birth_date" DATE,
    "avatar_url" TEXT,
    "role" "user_role" NOT NULL DEFAULT 'bidder',
    "status" "account_status" NOT NULL DEFAULT 'active',
    "rating_positive" INTEGER DEFAULT 0,
    "rating_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" SERIAL NOT NULL,
    "target_user_id" UUID NOT NULL,
    "from_user_id" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_upgrade_requests" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "seller_request_status" NOT NULL DEFAULT 'pending',
    "requested_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMPTZ,

    CONSTRAINT "seller_upgrade_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_permissions" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "seller_permission_status" NOT NULL DEFAULT 'active',
    "approved_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "seller_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "parent_id" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "seller_id" UUID NOT NULL,
    "category_id" INTEGER NOT NULL,
    "winner_id" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT,
    "start_price" DECIMAL(65,30) NOT NULL,
    "step_price" DECIMAL(65,30) NOT NULL,
    "buy_now_price" DECIMAL(65,30),
    "current_price" DECIMAL(65,30) NOT NULL,
    "post_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMPTZ NOT NULL,
    "is_auto_extend" BOOLEAN NOT NULL DEFAULT true,
    "is_instant_purchase" BOOLEAN NOT NULL DEFAULT false,
    "status" "product_status" NOT NULL DEFAULT 'active',
    "min_images" INTEGER DEFAULT 3,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bids" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "bidder_id" UUID NOT NULL,
    "max_bid" DECIMAL(65,30) NOT NULL,
    "status" "bid_status" NOT NULL DEFAULT 'valid',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watchlist" (
    "user_id" UUID NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watchlist_pkey" PRIMARY KEY ("user_id","product_id")
);

-- CreateTable
CREATE TABLE "bid_rejections" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "bidder_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bid_rejections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_questions" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "bidder_id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_answers" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "seller_id" UUID NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "winner_id" UUID NOT NULL,
    "seller_id" UUID NOT NULL,
    "status" "transaction_status" NOT NULL DEFAULT 'pending',
    "shipping_address" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_messages" (
    "id" SERIAL NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "sender_id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_settings" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "admin_settings_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_upgrade_requests" ADD CONSTRAINT "seller_upgrade_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_permissions" ADD CONSTRAINT "seller_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_bidder_id_fkey" FOREIGN KEY ("bidder_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_rejections" ADD CONSTRAINT "bid_rejections_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_rejections" ADD CONSTRAINT "bid_rejections_bidder_id_fkey" FOREIGN KEY ("bidder_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_questions" ADD CONSTRAINT "product_questions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_questions" ADD CONSTRAINT "product_questions_bidder_id_fkey" FOREIGN KEY ("bidder_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_answers" ADD CONSTRAINT "product_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "product_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_answers" ADD CONSTRAINT "product_answers_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_messages" ADD CONSTRAINT "transaction_messages_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_messages" ADD CONSTRAINT "transaction_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
