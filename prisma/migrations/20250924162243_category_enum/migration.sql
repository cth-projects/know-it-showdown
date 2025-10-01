/*
  Warnings:

  - The primary key for the `Game0To100Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `name` on the `Game0To100Category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `category` on the `Game0To100Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Game0To100CategoryType" AS ENUM ('DEFAULT', 'HEALTH', 'EDUCATION', 'WATER', 'ENERGY', 'EMPLOYMENT', 'TECHNOLOGY', 'URBAN_DEVELOPMENT', 'ENVIRONMENT');

-- DropForeignKey
ALTER TABLE "public"."Game0To100Question" DROP CONSTRAINT "Game0To100Question_category_fkey";

-- AlterTable
ALTER TABLE "public"."Game0To100Category" DROP CONSTRAINT "Game0To100Category_pkey",
DROP COLUMN "name",
ADD COLUMN     "name" "public"."Game0To100CategoryType" NOT NULL,
ADD CONSTRAINT "Game0To100Category_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "public"."Game0To100Question" DROP COLUMN "category",
ADD COLUMN     "category" "public"."Game0To100CategoryType" NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Game0To100Question" ADD CONSTRAINT "Game0To100Question_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."Game0To100Category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
