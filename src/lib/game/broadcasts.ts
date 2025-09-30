import type {
  PlayerGameAdvanceEvent,
  PresenterGameAdvanceEvent,
} from "@/types";
import { Game0To100State, type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { pusher } from "../pusher";
import { DEFAULT_ANSWER } from "./constants";

export async function handleGameBroadcasting(
  gameCode: string,
  nextState: Game0To100State,
  updatedGame: Prisma.Game0To100GetPayload<{
    include: { players: true; questions: true };
  }>,
) {
  switch (nextState) {
    case Game0To100State.QUESTION:
      await broadcastQuestionEvents(gameCode, updatedGame);
      break;

    case Game0To100State.RESULT:
      await broadcastResultEvents(gameCode, updatedGame);
      break;

    case Game0To100State.FINAL_RESULT:
      await broadcastFinalResultEvents(gameCode, updatedGame);
      break;
  }
}

export async function broadcastQuestionEvents(
  gameCode: string,
  updatedGame: Prisma.Game0To100GetPayload<{
    include: { players: true; questions: true };
  }>,
) {
  const currentQuestion =
    updatedGame.questions[updatedGame.currentQuestionIndex];

  if (!currentQuestion) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Question not found for current index",
    });
  }

  const baseEventData = {
    newState: "QUESTION" as const,
    currentQuestionIndex: updatedGame.currentQuestionIndex,
    totalQuestions: updatedGame.questions.length,
    timestamp: new Date().toISOString(),
  };

  const questionData = {
    question: currentQuestion.question,
    categoryName: currentQuestion.categoryName,
  };

  const playerEvent: PlayerGameAdvanceEvent = {
    ...baseEventData,
    currentQuestion: questionData,
  };

  const presenterEvent: PresenterGameAdvanceEvent = {
    ...baseEventData,
    currentQuestion: questionData,
  };

  await Promise.all([
    pusher.trigger(
      `presenter-${gameCode}`,
      "presenter-advanced",
      presenterEvent,
    ),
    pusher.trigger("player-" + gameCode, "game-advance", playerEvent),
  ]);
}

export async function broadcastResultEvents(
  gameCode: string,
  updatedGame: Prisma.Game0To100GetPayload<{
    include: { players: true; questions: true };
  }>,
) {
  const currentQuestion =
    updatedGame.questions[updatedGame.currentQuestionIndex];

  if (!currentQuestion) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Question not found for current index",
    });
  }

  const presenterEvent: PresenterGameAdvanceEvent = {
    newState: "RESULT",
    currentQuestionIndex: updatedGame.currentQuestionIndex,
    totalQuestions: updatedGame.questions.length,
    timestamp: new Date().toISOString(),
    questionResult: {
      question: currentQuestion.question,
      answer: currentQuestion.answer,
      categoryName: currentQuestion.categoryName,
    },
    playerResults: updatedGame.players.map((player) => {
      const playerAnswer =
        player.playerAnswers[updatedGame.currentQuestionIndex] ??
        DEFAULT_ANSWER;
      const isCorrect = playerAnswer === currentQuestion.answer;

      return {
        name: player.name,
        answer: playerAnswer,
        scoreForQuestion: isCorrect
          ? -10
          : Math.abs(playerAnswer - currentQuestion.answer),
        currentScore: player.score,
      };
    }),
  };

  await pusher.trigger(
    `presenter-${gameCode}`,
    "presenter-advanced",
    presenterEvent,
  );
}

export async function broadcastFinalResultEvents(
  gameCode: string,
  updatedGame: Prisma.Game0To100GetPayload<{
    include: { players: true; questions: true };
  }>,
) {
  const baseEventData = {
    newState: "FINAL_RESULT" as const,
    currentQuestionIndex: updatedGame.currentQuestionIndex,
    totalQuestions: updatedGame.questions.length,
    timestamp: new Date().toISOString(),
  };

  const finalResults = updatedGame.players
    .sort((a, b) => b.score - a.score)
    .map((player, index: number) => ({
      rank: index + 1,
      name: player.name,
      finalScore: player.score,
      totalCorrect: player.playerAnswers.filter(
        (answer: number, idx: number) =>
          answer === updatedGame.questions[idx]?.answer,
      ).length,
      totalQuestions: updatedGame.questions.length,
    }));

  const gameStats = {
    totalPlayers: updatedGame.players.length,
    totalQuestions: updatedGame.questions.length,
    averageScore:
      updatedGame.players.reduce((sum: number, p) => sum + p.score, 0) /
      updatedGame.players.length,
  };

  // broadcast to presenter only
  const presenterEvent: PresenterGameAdvanceEvent = {
    ...baseEventData,
    finalResults,
    gameStats,
  };

  await pusher.trigger(
    `presenter-${gameCode}`,
    "presenter-advanced",
    presenterEvent,
  );
}
