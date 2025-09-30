import { Game0To100State, type Prisma } from "@prisma/client";
import { pusher } from "../pusher";
import {
  buildQuestionEvent,
  buildResultEvent,
  buildFinalResultEvent,
} from "./event-builders";

type GameWithRelations = Prisma.Game0To100GetPayload<{
  include: {
    players: true;
    questions: {
      include: { category: true };
    };
  };
}>;

export async function handleGameBroadcasting(
  gameCode: string,
  nextState: Game0To100State,
  updatedGame: GameWithRelations,
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
  updatedGame: GameWithRelations,
) {
  const event = buildQuestionEvent(updatedGame);

  await Promise.all([
    pusher.trigger(`presenter-${gameCode}`, "presenter-advanced", event),
    pusher.trigger(`player-${gameCode}`, "game-advance", event),
  ]);
}

export async function broadcastResultEvents(
  gameCode: string,
  updatedGame: GameWithRelations,
) {
  const event = buildResultEvent(updatedGame);

  await pusher.trigger(`presenter-${gameCode}`, "presenter-advanced", event);
}

export async function broadcastFinalResultEvents(
  gameCode: string,
  updatedGame: GameWithRelations,
) {
  const event = buildFinalResultEvent(updatedGame);

  await Promise.all([
    pusher.trigger(`presenter-${gameCode}`, "presenter-advanced", event),
    pusher.trigger(`player-${gameCode}`, "game-advance", event),
  ]);
}
