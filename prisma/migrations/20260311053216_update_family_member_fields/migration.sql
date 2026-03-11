/*
  Warnings:

  - You are about to drop the column `role` on the `family_members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "family_members" DROP COLUMN "role",
ADD COLUMN     "causeOfDeath" TEXT,
ADD COLUMN     "currentResidence" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "marriageDate" TIMESTAMP(3),
ADD COLUMN     "marriagePlace" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "spouseFather" TEXT,
ADD COLUMN     "spouseMaidenName" TEXT,
ADD COLUMN     "spouseMother" TEXT;

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);
