-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_chat_id_fkey";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
