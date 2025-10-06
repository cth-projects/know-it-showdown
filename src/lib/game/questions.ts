import type { PrismaClient } from "@prisma/client";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

export async function getRandomQuestions(
  db: PrismaClient,
  totalQuestions: number,
): Promise<{ id: number }[]> {
  const categories = await db.game0To100Category.findMany({
    include: {
      questions: {
        select: { id: true },
      },
    },
  });

  const categoriesWithQuestions = categories
    .filter((cat) => cat.questions.length > 0)
    .map((cat) => ({
      name: cat.name,
      questions: shuffleArray(cat.questions),
      currentIndex: 0,
    }));

  const shuffledCategories = shuffleArray(categoriesWithQuestions);
  const selectedQuestions: { id: number }[] = [];

  while (
    selectedQuestions.length < totalQuestions &&
    shuffledCategories.length > 0
  ) {
    for (let i = shuffledCategories.length - 1; i >= 0; i--) {
      const category = shuffledCategories[i]!;

      if (category.currentIndex < category.questions.length) {
        selectedQuestions.push(category.questions[category.currentIndex]!);
        category.currentIndex++;

        if (selectedQuestions.length >= totalQuestions) break;
      } else {
        shuffledCategories.splice(i, 1);
      }
    }
  }

  return shuffleArray(selectedQuestions);
}
