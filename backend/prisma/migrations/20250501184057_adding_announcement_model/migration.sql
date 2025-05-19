-- CreateTable
CREATE TABLE "Announcment" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "eventId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Announcment" ADD CONSTRAINT "Announcment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcment" ADD CONSTRAINT "Announcment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
