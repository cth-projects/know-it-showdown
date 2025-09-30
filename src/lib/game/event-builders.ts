// src/lib/game/event-builders.ts
import type { QuestionEvent, ResultEvent, FinalResultEvent } from "@/types";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { calculateScore } from "./scoring";
import { DEFAULT_ANSWER } from "./constants";

type GameWithRelations = Prisma.Game0To100GetPayload<{
  include: {
    players: true;
    questions: {
      include: { category: true };
    };
  };
}>;

function buildBaseEventData(game: GameWithRelations) {
  return {
    currentQuestionIndex: game.currentQuestionIndex,
    totalQuestions: game.questions.length,
    timestamp: new Date().toISOString(),
  };
}

function getCurrentQuestion(game: GameWithRelations) {
  const currentQuestion = game.questions[game.currentQuestionIndex];

  if (!currentQuestion) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Question not found for current index",
    });
  }

  return currentQuestion;
}

export function buildQuestionEvent(game: GameWithRelations): QuestionEvent {
  const currentQuestion = getCurrentQuestion(game);

  return {
    ...buildBaseEventData(game),
    newState: "QUESTION",
    currentQuestion: {
      question: currentQuestion.question,
      category: {
        title: currentQuestion.category.title,
        sdgNumber: currentQuestion.category.sdgNumber,
        description: currentQuestion.category.description,
        color: currentQuestion.category.color,
      },
    },
  };
}

export function buildResultEvent(game: GameWithRelations): ResultEvent {
  const currentQuestion = getCurrentQuestion(game);

  return {
    ...buildBaseEventData(game),
    newState: "RESULT",
    questionResult: {
      question: currentQuestion.question,
      answer: currentQuestion.answer,
      category: {
        title: currentQuestion.category.title,
        sdgNumber: currentQuestion.category.sdgNumber,
        description: currentQuestion.category.description,
        color: currentQuestion.category.color,
      },
    },
    playerResults: game.players.map((player) => {
      const playerAnswer =
        player.playerAnswers[game.currentQuestionIndex] ?? DEFAULT_ANSWER;

      return {
        name: player.name,
        answer: playerAnswer,
        scoreForQuestion: calculateScore(playerAnswer, currentQuestion.answer),
        currentScore: player.score,
      };
    }),
  };
}
export function buildFinalResultEvent(
  game: GameWithRelations,
): FinalResultEvent {
  const finalResults = game.players
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({
      rank: index + 1,
      name: player.name,
      finalScore: player.score,
    }));

  return {
    ...buildBaseEventData(game),
    newState: "FINAL_RESULT",
    finalResults,
    gameStats: {
      totalPlayers: game.players.length,
      totalQuestions: game.questions.length,
    },
  };
}
