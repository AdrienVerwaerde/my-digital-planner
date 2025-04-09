/*
  Warnings:

  - You are about to drop the column `eventTypeId` on the `UserEvent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserEvent" DROP CONSTRAINT "UserEvent_eventTypeId_fkey";

-- AlterTable
ALTER TABLE "UserEvent" DROP COLUMN "eventTypeId",
ADD COLUMN     "eventId" TEXT;

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
