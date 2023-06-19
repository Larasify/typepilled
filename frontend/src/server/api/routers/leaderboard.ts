import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const leaderboardRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        wpm: z.number(),
        accuracy: z.number(),
        wordcount: z.number(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { type, wpm, accuracy, wordcount, userId } = input;
      const leaderboardEntry = await prisma.leaderboard.create({
        data: {
          type,
          wpm,
          accuracy,
          wordcount,
          userId,
        },
      });

      return { success: true, leaderboardEntry };
    }),
});
