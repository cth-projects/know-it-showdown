-- CreateEnum
CREATE TYPE "public"."GameState" AS ENUM ('LOBBY', 'QUESTION', 'RESULT', 'FINAL_RESULT');

-- CreateTable
CREATE TABLE "public"."Player" (
    "name" TEXT NOT NULL,
    "gameCode" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "playerAnswers" INTEGER[],

    CONSTRAINT "Player_pkey" PRIMARY KEY ("name","gameCode")
);

-- CreateTable
CREATE TABLE "public"."Game" (
    "gameCode" TEXT NOT NULL,
    "gameState" "public"."GameState" NOT NULL DEFAULT 'LOBBY',
    "currentQuestion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("gameCode")
);

-- CreateTable
CREATE TABLE "public"."_GameToQuestion" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GameToQuestion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GameToQuestion_B_index" ON "public"."_GameToQuestion"("B");

-- AddForeignKey
ALTER TABLE "public"."Player" ADD CONSTRAINT "Player_gameCode_fkey" FOREIGN KEY ("gameCode") REFERENCES "public"."Game"("gameCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GameToQuestion" ADD CONSTRAINT "_GameToQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Game"("gameCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GameToQuestion" ADD CONSTRAINT "_GameToQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
