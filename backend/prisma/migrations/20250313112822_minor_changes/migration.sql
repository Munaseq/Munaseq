/*
  Warnings:

  - You are about to drop the column `answerMaterialUrl` on the `TakeAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `textAnswers` on the `TakeAssignment` table. All the data in the column will be lost.
  - Added the required column `answers` to the `TakeAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "TakeAssignment" DROP CONSTRAINT "TakeAssignment_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "TakeAssignment" DROP CONSTRAINT "TakeAssignment_userId_fkey";

-- AlterTable
ALTER TABLE "TakeAssignment" DROP COLUMN "answerMaterialUrl",
DROP COLUMN "textAnswers",
ADD COLUMN     "answers" JSONB NOT NULL;

-- AddForeignKey
ALTER TABLE "TakeAssignment" ADD CONSTRAINT "TakeAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TakeAssignment" ADD CONSTRAINT "TakeAssignment_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
