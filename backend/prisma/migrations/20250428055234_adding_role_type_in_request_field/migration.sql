/*
  Warnings:

  - The values [ROLE_REQUEST,EVENT_REQUEST] on the enum `InvitationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InvitationType_new" AS ENUM ('ROLE_INVITATION', 'EVENT_INVITATION');
ALTER TABLE "Invitation" ALTER COLUMN "invitationType" TYPE "InvitationType_new" USING ("invitationType"::text::"InvitationType_new");
ALTER TYPE "InvitationType" RENAME TO "InvitationType_old";
ALTER TYPE "InvitationType_new" RENAME TO "InvitationType";
DROP TYPE "InvitationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "roleType" "RoleType";
