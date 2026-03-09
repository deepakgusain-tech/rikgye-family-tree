/*
  Warnings:

  - The primary key for the `Settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Settings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Settings_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Page" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pageTitle" TEXT,
    "pageIcon" TEXT,
    "pageContent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);
