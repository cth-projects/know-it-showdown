import { Game0To100State } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export function determineNextState(
  currentState: Game0To100State,
  currentQuestionIndex: number,
  totalQuestions: number,
) {
  switch (currentState) {
    case Game0To100State.QUESTION:
      return Game0To100State.RESULT;

    case Game0To100State.RESULT:
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex >= totalQuestions) {
        return Game0To100State.FINAL_RESULT;
      }
      return Game0To100State.QUESTION;

    case Game0To100State.FINAL_RESULT:
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Game has already ended.",
      });

    default:
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unknown state: " + String(currentState),
      });
  }
}
