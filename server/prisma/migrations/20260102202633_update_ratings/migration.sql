/*
  Warnings:

  - A unique constraint covering the columns `[product_id,type]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `ratings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "rating_type" AS ENUM ('seller_bidder', 'bidder_seller');

-- DropIndex
DROP INDEX "ratings_product_id_key";

-- AlterTable
ALTER TABLE "ratings" ADD COLUMN     "type" "rating_type" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ratings_product_id_type_key" ON "ratings"("product_id", "type");
