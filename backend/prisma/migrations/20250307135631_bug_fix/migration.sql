/*
  Warnings:

  - You are about to drop the column `privateChat_id` on the `Message` table. All the data in the column will be lost.
  - Added the required column `chat_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_privateChat_id_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "privateChat_id",
ADD COLUMN     "chat_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
