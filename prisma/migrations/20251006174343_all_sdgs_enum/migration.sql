-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."Game0To100CategoryType" ADD VALUE 'POVERTY';
ALTER TYPE "public"."Game0To100CategoryType" ADD VALUE 'HUNGER';
ALTER TYPE "public"."Game0To100CategoryType" ADD VALUE 'GENDER';
ALTER TYPE "public"."Game0To100CategoryType" ADD VALUE 'INEQUALITY';
ALTER TYPE "public"."Game0To100CategoryType" ADD VALUE 'CONSUMPTION';
ALTER TYPE "public"."Game0To100CategoryType" ADD VALUE 'CLIMATE';
ALTER TYPE "public"."Game0To100CategoryType" ADD VALUE 'OCEANS';
ALTER TYPE "public"."Game0To100CategoryType" ADD VALUE 'PEACE';
ALTER TYPE "public"."Game0To100CategoryType" ADD VALUE 'PARTNERSHIPS';
