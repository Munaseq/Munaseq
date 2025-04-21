-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_event_id_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "event_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
