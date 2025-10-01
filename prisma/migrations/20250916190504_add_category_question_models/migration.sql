-- CreateTable
CREATE TABLE "public"."Category" (
  "name" TEXT NOT NULL
  , CONSTRAINT "Category_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."Question" (
  "id" SERIAL NOT NULL
  , "question" TEXT NOT NULL
  , "answer" INTEGER NOT NULL
  , "category" TEXT NOT NULL
  , "updatedAt" TIMESTAMP(3) NOT NULL
  , CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_question_key"
ON "public"."Question"("question");

-- AddForeignKey
ALTER TABLE "public"."Question"
ADD CONSTRAINT "Question_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."Category"("name")
ON DELETE RESTRICT
ON
UPDATE
  CASCADE;