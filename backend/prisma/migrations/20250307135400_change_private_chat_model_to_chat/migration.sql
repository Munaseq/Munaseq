/*
  Warnings:

  - You are about to drop the column `event_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `receiver_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `PrivateChat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PrivateChat` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[chat_id]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chat_id` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChatCategory" AS ENUM ('Direct_Message_Chat', 'Group_Message_Chat');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_event_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_privateChat_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "_PrivateChat" DROP CONSTRAINT "_PrivateChat_A_fkey";

-- DropForeignKey
ALTER TABLE "_PrivateChat" DROP CONSTRAINT "_PrivateChat_B_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "chat_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "event_id",
DROP COLUMN "receiver_id";

-- DropTable
DROP TABLE "PrivateChat";

-- DropTable
DROP TABLE "_PrivateChat";

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "Category" "ChatCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AssociatedWith" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AssociatedWith_AB_unique" ON "_AssociatedWith"("A", "B");

-- CreateIndex
CREATE INDEX "_AssociatedWith_B_index" ON "_AssociatedWith"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Event_chat_id_key" ON "Event"("chat_id");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_privateChat_id_fkey" FOREIGN KEY ("privateChat_id") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssociatedWith" ADD CONSTRAINT "_AssociatedWith_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssociatedWith" ADD CONSTRAINT "_AssociatedWith_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
