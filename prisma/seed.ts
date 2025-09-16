/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const categories = [
    "Math",
    "Science",
    "Geography",
    "History",
    "Sports",
    "General",
    "Biology",
    "Physics",
  ];

  for (const categoryName of categories) {
    await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });
  }

  const sampleQuestions = [
    {
      question: "What percentage of Earth's surface is covered by water?",
      answer: 71,
      categoryName: "Geography",
    },
    {
      question: "At what temperature does water freeze in Celsius?",
      answer: 0,
      categoryName: "Science",
    },
    {
      question: "How many minutes are in one hour?",
      answer: 60,
      categoryName: "Math",
    },
    {
      question: "What percentage of the human body is approximately water?",
      answer: 60,
      categoryName: "Biology",
    },
    {
      question: "In what year did World War II end? (Enter last two digits)",
      answer: 45,
      categoryName: "History",
    },
    {
      question: "How many states are there in the United States?",
      answer: 50,
      categoryName: "Geography",
    },
    { question: "What is 25% of 80?", answer: 20, categoryName: "Math" },
    {
      question:
        "What is the normal human body temperature in Fahrenheit? (Rounded)",
      answer: 98,
      categoryName: "Biology",
    },
    {
      question:
        "How many players are on a basketball team on the court at once?",
      answer: 5,
      categoryName: "Sports",
    },
    {
      question: "What percentage of Earth's atmosphere is nitrogen? (Rounded)",
      answer: 78,
      categoryName: "Science",
    },
    {
      question: "At what temperature does water boil in Celsius?",
      answer: 100,
      categoryName: "Physics",
    },
    {
      question: "How many weeks are in a year? (Rounded)",
      answer: 52,
      categoryName: "General",
    },
    { question: "What is 8 x 9?", answer: 72, categoryName: "Math" },
    {
      question: "How many continents are there?",
      answer: 7,
      categoryName: "Geography",
    },
    {
      question: "What percentage of adult humans can curl their tongue?",
      answer: 68,
      categoryName: "Biology",
    },
    {
      question: "How many chambers does a human heart have?",
      answer: 4,
      categoryName: "Biology",
    },
    { question: "What is 15% of 200?", answer: 30, categoryName: "Math" },
    {
      question: "How many sides does a triangle have?",
      answer: 3,
      categoryName: "Math",
    },
    {
      question: "What is the atomic number of carbon?",
      answer: 6,
      categoryName: "Science",
    },
    {
      question:
        "How many players are on a football (soccer) team on the field?",
      answer: 11,
      categoryName: "Sports",
    },
  ];

  for (const questionData of sampleQuestions) {
    await prisma.question.upsert({
      where: { question: questionData.question },
      update: {},
      create: questionData,
    });
  }

  console.log(
    "Database seeded with",
    categories.length,
    "categories and",
    sampleQuestions.length,
    "questions",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
