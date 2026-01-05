/*
  Warnings:

  - The values [locked] on the enum `account_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "account_status_new" AS ENUM ('active', 'deleted');
ALTER TABLE "public"."profiles" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "profiles" ALTER COLUMN "status" TYPE "account_status_new" USING ("status"::text::"account_status_new");
ALTER TYPE "account_status" RENAME TO "account_status_old";
ALTER TYPE "account_status_new" RENAME TO "account_status";
DROP TYPE "public"."account_status_old";
ALTER TABLE "profiles" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;
