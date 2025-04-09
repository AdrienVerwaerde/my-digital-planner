/*
  Warnings:

  - You are about to drop the `_EventParticipants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EventParticipants" DROP CONSTRAINT "_EventParticipants_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventParticipants" DROP CONSTRAINT "_EventParticipants_B_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "date" DROP NOT NULL;

-- DropTable
DROP TABLE "_EventParticipants";

-- CreateTable
CREATE TABLE "UserEvent" (
    "id" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "locationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "eventTypeId" TEXT,

    CONSTRAINT "UserEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserEventParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserEventParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserEventParticipants_B_index" ON "_UserEventParticipants"("B");

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserEventParticipants" ADD CONSTRAINT "_UserEventParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserEventParticipants" ADD CONSTRAINT "_UserEventParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "UserEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
