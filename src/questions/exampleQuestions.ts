import { Game0To100CategoryType } from "@prisma/client";

export const sampleQuestions = [
  {
    question: "What percentage of the human body is approximately water?",
    answer: 60,
    categoryName: Game0To100CategoryType.HEALTH,
    // source: example.com
  },
  {
    question: "What percentage of the world's population can read and write?",
    answer: 86,
    categoryName: Game0To100CategoryType.EDUCATION,
    // source: example2.com
  },
];
