/* eslint-disable @typescript-eslint/no-misused-promises */

import { PrismaClient } from "@prisma/client";
import { Game0To100State } from "@prisma/client";

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
    await prisma.game0To100Category.upsert({
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
    await prisma.game0To100Question.upsert({
      where: { question: questionData.question },
      update: {},
      create: questionData,
    });
  }

  const testGames = [
    {
      gameCode: "LOBBY1",
      upstashId: "upstash-lobby-test",
      gameState: Game0To100State.LOBBY,
      currentQuestionIndex: 0,
      players: [
        { name: "Player1", score: 0, playerAnswers: [] },
        { name: "Player2", score: 0, playerAnswers: [] },
      ],
    },
    {
      gameCode: "QUEST1",
      upstashId: "upstash-question-test",
      gameState: Game0To100State.QUESTION,
      currentQuestionIndex: 2,
      players: [
        { name: "Alice", score: 15, playerAnswers: [71, 0] },
        { name: "Bob", score: 25, playerAnswers: [70, 0] },
        { name: "Charlie", score: 10, playerAnswers: [75, 5] },
      ],
    },
    {
      gameCode: "RESULT",
      upstashId: "upstash-result-test",
      gameState: Game0To100State.RESULT,
      currentQuestionIndex: 2,
      players: [
        { name: "Dave", score: 45, playerAnswers: [71, 0, 60] },
        { name: "Emma", score: 35, playerAnswers: [70, 2, 65] },
      ],
    },
    {
      gameCode: "FINAL1",
      upstashId: "upstash-final-test",
      gameState: Game0To100State.FINAL_RESULT,
      currentQuestionIndex: 4,
      players: [
        { name: "Frank", score: 120, playerAnswers: [71, 0, 60, 60, 45] },
        { name: "Grace", score: 105, playerAnswers: [70, 2, 65, 55, 40] },
        { name: "Henry", score: 90, playerAnswers: [75, 5, 58, 65, 50] },
      ],
    },
  ];

  const questions = await prisma.game0To100Question.findMany({
    take: 5,
  });

  for (const testGame of testGames) {
    await prisma.game.upsert({
      where: { gameCode: testGame.gameCode },
      update: {},
      create: {
        gameCode: testGame.gameCode,
        upstashId: testGame.upstashId,
      },
    });

    await prisma.game0To100.upsert({
      where: { gameCode: testGame.gameCode },
      update: {
        gameState: testGame.gameState,
        currentQuestionIndex: testGame.currentQuestionIndex,
      },
      create: {
        gameCode: testGame.gameCode,
        gameState: testGame.gameState,
        currentQuestionIndex: testGame.currentQuestionIndex,
        questions: {
          connect: questions.map((q) => ({ id: q.id })),
        },
      },
    });

    for (const playerData of testGame.players) {
      await prisma.game0To100Player.upsert({
        where: {
          name_gameCode: {
            name: playerData.name,
            gameCode: testGame.gameCode,
          },
        },
        update: {
          score: playerData.score,
          playerAnswers: playerData.playerAnswers,
        },
        create: {
          name: playerData.name,
          gameCode: testGame.gameCode,
          score: playerData.score,
          playerAnswers: playerData.playerAnswers,
        },
      });
    }
  }

  console.log(
    "Database seeded with:",
    `\n- ${categories.length} categories`,
    `\n- ${sampleQuestions.length} questions`,
    `\n- ${testGames.length} test games: LOBBY1, QUEST1, RESULT, FINAL1`,
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
