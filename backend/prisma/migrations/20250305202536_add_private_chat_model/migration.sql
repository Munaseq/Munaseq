/*
  Warnings:

  - Added the required column `privateChat_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "privateChat_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PrivateChat" (
    "id" TEXT NOT NULL,

    CONSTRAINT "PrivateChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PrivateChat" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PrivateChat_AB_unique" ON "_PrivateChat"("A", "B");

-- CreateIndex
CREATE INDEX "_PrivateChat_B_index" ON "_PrivateChat"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_privateChat_id_fkey" FOREIGN KEY ("privateChat_id") REFERENCES "PrivateChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PrivateChat" ADD CONSTRAINT "_PrivateChat_A_fkey" FOREIGN KEY ("A") REFERENCES "PrivateChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PrivateChat" ADD CONSTRAINT "_PrivateChat_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
