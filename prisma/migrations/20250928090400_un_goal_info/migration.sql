/*
  Warnings:

  - Added the required column `color` to the `Game0To100Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Game0To100Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sdgNumber` to the `Game0To100Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Game0To100Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Game0To100Category" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "sdgNumber" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
