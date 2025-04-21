/*
  Warnings:

  - You are about to drop the column `chat_id` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[event_id]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_chat_id_fkey";

-- DropIndex
DROP INDEX "Event_chat_id_key";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "event_id" TEXT;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "chat_id";

-- CreateIndex
CREATE UNIQUE INDEX "Chat_event_id_key" ON "Chat"("event_id");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
