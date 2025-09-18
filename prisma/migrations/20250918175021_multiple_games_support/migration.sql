/*
  Warnings:

  - You are about to drop the column `currentQuestion` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `gameState` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GameToQuestion` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[upstashId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `upstashId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Game0To100State" AS ENUM ('LOBBY', 'QUESTION', 'RESULT', 'FINAL_RESULT');

-- DropForeignKey
ALTER TABLE "public"."Player" DROP CONSTRAINT "Player_gameCode_fkey";

-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_category_fkey";

-- DropForeignKey
ALTER TABLE "public"."_GameToQuestion" DROP CONSTRAINT "_GameToQuestion_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_GameToQuestion" DROP CONSTRAINT "_GameToQuestion_B_fkey";

-- AlterTable
ALTER TABLE "public"."Game" DROP COLUMN "currentQuestion",
DROP COLUMN "gameState",
ADD COLUMN     "upstashId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Category";

-- DropTable
DROP TABLE "public"."Player";

-- DropTable
DROP TABLE "public"."Question";

-- DropTable
DROP TABLE "public"."_GameToQuestion";

-- DropEnum
DROP TYPE "public"."GameState";

-- CreateTable
CREATE TABLE "public"."Game0To100" (
    "gameCode" TEXT NOT NULL,
    "gameState" "public"."Game0To100State" NOT NULL DEFAULT 'LOBBY',
    "currentQuestionIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game0To100_pkey" PRIMARY KEY ("gameCode")
);

-- CreateTable
CREATE TABLE "public"."Game0To100Player" (
    "name" TEXT NOT NULL,
    "gameCode" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "playerAnswers" INTEGER[],

    CONSTRAINT "Game0To100Player_pkey" PRIMARY KEY ("name","gameCode")
);

-- CreateTable
CREATE TABLE "public"."Game0To100Category" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Game0To100Category_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."Game0To100Question" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game0To100Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_Game0To100ToGame0To100Question" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Game0To100ToGame0To100Question_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game0To100Question_question_key" ON "public"."Game0To100Question"("question");

-- CreateIndex
CREATE INDEX "_Game0To100ToGame0To100Question_B_index" ON "public"."_Game0To100ToGame0To100Question"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Game_upstashId_key" ON "public"."Game"("upstashId");

-- CreateIndex
CREATE INDEX "Game_upstashId_idx" ON "public"."Game"("upstashId");

-- AddForeignKey
ALTER TABLE "public"."Game0To100" ADD CONSTRAINT "Game0To100_gameCode_fkey" FOREIGN KEY ("gameCode") REFERENCES "public"."Game"("gameCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Game0To100Player" ADD CONSTRAINT "Game0To100Player_gameCode_fkey" FOREIGN KEY ("gameCode") REFERENCES "public"."Game0To100"("gameCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Game0To100Question" ADD CONSTRAINT "Game0To100Question_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."Game0To100Category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Game0To100ToGame0To100Question" ADD CONSTRAINT "_Game0To100ToGame0To100Question_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Game0To100"("gameCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Game0To100ToGame0To100Question" ADD CONSTRAINT "_Game0To100ToGame0To100Question_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Game0To100Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
