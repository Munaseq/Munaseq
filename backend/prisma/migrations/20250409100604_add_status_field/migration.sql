/*
  Warnings:

  - Added the required column `status` to the `TakeAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TakeStatus" AS ENUM ('NOT_ANSWERED', 'SAVED_ANSWER', 'SUBMITTED');

-- AlterTable
ALTER TABLE "TakeAssignment" ADD COLUMN     "status" "TakeStatus" NOT NULL;
