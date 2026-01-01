-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "payment_proof" TEXT,
ADD COLUMN     "shipping_receipt" TEXT,
ALTER COLUMN "shipping_address" DROP NOT NULL;
