/*
  Warnings:

  - A unique constraint covering the columns `[product_id]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_id` to the `ratings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ratings" ADD COLUMN     "product_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ratings_product_id_key" ON "ratings"("product_id");

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
