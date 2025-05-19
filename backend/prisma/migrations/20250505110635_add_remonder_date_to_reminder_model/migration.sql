/*
  Warnings:

  - Added the required column `reminderDate` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "reminderDate" TIMESTAMP(3) NOT NULL;
