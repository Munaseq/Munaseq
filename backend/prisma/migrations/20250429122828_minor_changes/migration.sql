/*
  Warnings:

  - You are about to drop the column `eventId` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Certificate` table. All the data in the column will be lost.
  - Added the required column `event_Id` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_Id` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_userId_fkey";

-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "eventId",
DROP COLUMN "userId",
ADD COLUMN     "event_Id" TEXT NOT NULL,
ADD COLUMN     "user_Id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_event_Id_fkey" FOREIGN KEY ("event_Id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
