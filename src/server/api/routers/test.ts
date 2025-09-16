import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { pusher } from "@/lib/pusher";

export const testRouter = createTRPCRouter({
  pusher: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      await pusher.trigger("test", "test-event", {
        name: input.name,
        timestamp: Date.now(),
      });

      return { success: true };
    }),
});
