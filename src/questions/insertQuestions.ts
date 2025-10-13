import { getSDGCategories } from "@/lib/sdg-categories";
import { PrismaClient } from "@prisma/client";
import { questions } from "./questions";

const prisma = new PrismaClient();

export async function insertQuestions() {
  try {
    const categories = getSDGCategories();

    for (const categoryData of categories) {
      await prisma.game0To100Category.upsert({
        where: { name: categoryData.name },
        update: categoryData,
        create: categoryData,
      });
    }

    for (const questionData of questions) {
      await prisma.game0To100Question.upsert({
        where: { question: questionData.question },
        update: questionData,
        create: questionData,
      });
    }

    const categoryCounts: Record<string, number> = {};

    questions.forEach((q) => {
      categoryCounts[q.categoryName] =
        (categoryCounts[q.categoryName] ?? 0) + 1;
    });

    return {
      questionsSeeded: questions.length,
      categoriesSeeded: categories.length,
      categoryCounts,
    };
  } finally {
    await prisma.$disconnect();
  }
}
