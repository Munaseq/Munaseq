/*
  Warnings:

  - The `roleType` column on the `Invitation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('MODERATOR', 'PRESENTER');

-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "roleType",
ADD COLUMN     "roleType" "RoleType";

-- DropEnum
DROP TYPE "IRoleType";
