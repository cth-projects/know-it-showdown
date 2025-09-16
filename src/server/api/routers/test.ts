import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { pusher } from "@/lib/pusher";
import { TRPCError } from "@trpc/server";

export const testRouter = createTRPCRouter({
  pusher: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await pusher.trigger("test", "test-event", {
          name: input.name,
          timestamp: Date.now(),
        });

        return { success: true };
      } catch (error) {
        console.error("Pusher error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send Pusher event",
          cause: error,
        });
      }
    }),
});
