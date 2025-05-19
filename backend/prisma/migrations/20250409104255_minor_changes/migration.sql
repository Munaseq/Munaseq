/*
  Warnings:

  - The values [SAVED_ANSWER] on the enum `TakeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TakeStatus_new" AS ENUM ('NOT_ANSWERED', 'SAVED_ANSWERS', 'SUBMITTED');
ALTER TABLE "TakeAssignment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "TakeAssignment" ALTER COLUMN "status" TYPE "TakeStatus_new" USING ("status"::text::"TakeStatus_new");
ALTER TYPE "TakeStatus" RENAME TO "TakeStatus_old";
ALTER TYPE "TakeStatus_new" RENAME TO "TakeStatus";
DROP TYPE "TakeStatus_old";
ALTER TABLE "TakeAssignment" ALTER COLUMN "status" SET DEFAULT 'NOT_ANSWERED';
COMMIT;
