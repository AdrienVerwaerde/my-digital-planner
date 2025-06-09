/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "surname" DROP NOT NULL,
ALTER COLUMN "surname" DROP DEFAULT;

-- CreateTable
CREATE TABLE "EventSuggestion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "hour" TIMESTAMP(3) NOT NULL,
    "message" TEXT,
    "userName" TEXT NOT NULL,
    "userSurname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventSuggestion_pkey" PRIMARY KEY ("id")
);
