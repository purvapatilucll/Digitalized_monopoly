/*
  Warnings:

  - The `Ddossed` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `Protected` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Ddossed",
ADD COLUMN     "Ddossed" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "Protected",
ADD COLUMN     "Protected" INTEGER NOT NULL DEFAULT 0;
