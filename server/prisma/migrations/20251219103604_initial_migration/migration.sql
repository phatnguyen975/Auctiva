-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('bidder', 'seller', 'admin');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "user_name" TEXT,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "address" TEXT,
    "birth_date" DATE,
    "avatar_url" TEXT,
    "role" "user_role" DEFAULT 'bidder',
    "rating_positive" INTEGER DEFAULT 0,
    "rating_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");
