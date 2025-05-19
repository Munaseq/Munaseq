/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `Reminder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reminder_userId_eventId_key" ON "Reminder"("userId", "eventId");
