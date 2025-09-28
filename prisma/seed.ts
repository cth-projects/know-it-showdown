/* eslint-disable @typescript-eslint/no-misused-promises */

import { PrismaClient } from "@prisma/client";
import { Game0To100State, Game0To100CategoryType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const categories = [
    {
      name: Game0To100CategoryType.HEALTH,
      title: "Good Health and Well-Being",
      sdgNumber: 3,
      description:
        "Ensure healthy lives and promote well-being for all at all ages. This includes reducing maternal mortality, ending preventable deaths of children, combating diseases, and ensuring access to healthcare services.",
      color: "#4C9F38",
    },
    {
      name: Game0To100CategoryType.EDUCATION,
      title: "Quality Education",
      sdgNumber: 4,
      description:
        "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all. This includes achieving literacy, numeracy, and ensuring equal access to education.",
      color: "#C5192D",
    },
    {
      name: Game0To100CategoryType.WATER,
      title: "Clean Water and Sanitation",
      sdgNumber: 6,
      description:
        "Ensure availability and sustainable management of water and sanitation for all. This includes achieving access to safe drinking water, adequate sanitation, and improved water quality.",
      color: "#26BDE2",
    },
    {
      name: Game0To100CategoryType.ENERGY,
      title: "Affordable and Clean Energy",
      sdgNumber: 7,
      description:
        "Ensure access to affordable, reliable, sustainable and modern energy for all. This includes increasing the share of renewable energy and improving energy efficiency.",
      color: "#FCC30B",
    },
    {
      name: Game0To100CategoryType.EMPLOYMENT,
      title: "Decent Work and Economic Growth",
      sdgNumber: 8,
      description:
        "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all. This includes reducing unemployment and promoting safe working environments.",
      color: "#A21942",
    },
    {
      name: Game0To100CategoryType.TECHNOLOGY,
      title: "Industry, Innovation and Infrastructure",
      sdgNumber: 9,
      description:
        "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation. This includes increasing access to information and communication technology.",
      color: "#FD6925",
    },
    {
      name: Game0To100CategoryType.URBAN_DEVELOPMENT,
      title: "Sustainable Cities and Communities",
      sdgNumber: 11,
      description:
        "Make cities and human settlements inclusive, safe, resilient and sustainable. This includes ensuring access to adequate housing, sustainable transport systems, and inclusive urbanization.",
      color: "#FD9D24",
    },
    {
      name: Game0To100CategoryType.ENVIRONMENT,
      title: "Life on Land",
      sdgNumber: 15,
      description:
        "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt biodiversity loss.",
      color: "#56C02B",
    },
  ];

  for (const categoryData of categories) {
    await prisma.game0To100Category.upsert({
      where: { name: categoryData.name },
      update: {
        title: categoryData.title,
        sdgNumber: categoryData.sdgNumber,
        description: categoryData.description,
        color: categoryData.color,
      },
      create: categoryData,
    });
  }

  const sampleQuestions = [
    {
      question: "What percentage of the human body is approximately water?",
      answer: 60,
      categoryName: Game0To100CategoryType.HEALTH,
    },
    {
      question:
        "What is the normal human body temperature in Fahrenheit? (Rounded)",
      answer: 98,
      categoryName: Game0To100CategoryType.HEALTH,
    },
    {
      question: "What percentage of adults globally are overweight or obese?",
      answer: 39,
      categoryName: Game0To100CategoryType.HEALTH,
    },
    {
      question: "What percentage of the world's population can read and write?",
      answer: 86,
      categoryName: Game0To100CategoryType.EDUCATION,
    },
    {
      question:
        "How many years of primary education do most countries provide?",
      answer: 6,
      categoryName: Game0To100CategoryType.EDUCATION,
    },
    {
      question: "What percentage of children globally complete primary school?",
      answer: 91,
      categoryName: Game0To100CategoryType.EDUCATION,
    },
    {
      question: "What percentage of Earth's surface is covered by water?",
      answer: 71,
      categoryName: Game0To100CategoryType.WATER,
    },
    {
      question:
        "What percentage of adults globally have access to clean drinking water?",
      answer: 90,
      categoryName: Game0To100CategoryType.WATER,
    },
    {
      question: "What percentage of Earth's water is freshwater?",
      answer: 3,
      categoryName: Game0To100CategoryType.WATER,
    },
    {
      question:
        "What percentage of global energy comes from renewable sources?",
      answer: 30,
      categoryName: Game0To100CategoryType.ENERGY,
    },
    {
      question: "At what temperature does water boil in Celsius?",
      answer: 100,
      categoryName: Game0To100CategoryType.ENERGY,
    },
    {
      question:
        "What percentage of global electricity comes from fossil fuels?",
      answer: 62,
      categoryName: Game0To100CategoryType.ENERGY,
    },
    {
      question: "What percentage of the global workforce is unemployed?",
      answer: 6,
      categoryName: Game0To100CategoryType.EMPLOYMENT,
    },
    {
      question: "What percentage of the global workforce works in agriculture?",
      answer: 27,
      categoryName: Game0To100CategoryType.EMPLOYMENT,
    },
    {
      question: "What is the average retirement age globally? (Rounded)",
      answer: 64,
      categoryName: Game0To100CategoryType.EMPLOYMENT,
    },
    {
      question:
        "What percentage of the world's population has internet access?",
      answer: 65,
      categoryName: Game0To100CategoryType.TECHNOLOGY,
    },
    {
      question: "What percentage of the global population owns a smartphone?",
      answer: 68,
      categoryName: Game0To100CategoryType.TECHNOLOGY,
    },
    {
      question:
        "How many hours per day does the average person spend on their phone?",
      answer: 7,
      categoryName: Game0To100CategoryType.TECHNOLOGY,
    },
    {
      question:
        "What percentage of the world's population lives in urban areas?",
      answer: 55,
      categoryName: Game0To100CategoryType.URBAN_DEVELOPMENT,
    },
    {
      question: "What percentage of global GDP is generated by cities?",
      answer: 80,
      categoryName: Game0To100CategoryType.URBAN_DEVELOPMENT,
    },
    {
      question:
        "How many megacities (over 10 million people) are there globally?",
      answer: 33,
      categoryName: Game0To100CategoryType.URBAN_DEVELOPMENT,
    },
    {
      question: "What percentage of Earth's atmosphere is nitrogen? (Rounded)",
      answer: 78,
      categoryName: Game0To100CategoryType.ENVIRONMENT,
    },
    {
      question:
        "What percentage of global greenhouse gas emissions come from agriculture?",
      answer: 24,
      categoryName: Game0To100CategoryType.ENVIRONMENT,
    },
    {
      question: "What percentage of the Amazon rainforest has been deforested?",
      answer: 17,
      categoryName: Game0To100CategoryType.ENVIRONMENT,
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
    `\n- ${categories.length} categories with UN SDG information`,
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
