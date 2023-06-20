import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const leaderboardRouter = createTRPCRouter({
  getpublicleaderboard: publicProcedure.query(async () => {
    const leaderboard = await prisma.leaderboard.findMany({
      select: {
        user: true,
        id: true,
        createdAt: true,
        type: true,
        wpm: true,
        accuracy: true,
        wordcount: true,
        userId: true,
        punctuation: true,
        numbers: true,
      },
      orderBy: {
        wpm: "desc",
      },
      take: 50,
    });

    return { success: true, leaderboard };
  }),
  create: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        wpm: z.number(),
        accuracy: z.number(),
        wordcount: z.number(),
        userId: z.string(),
        punctuation: z.boolean(),
        numbers: z.boolean()
      })
    )
    .mutation(async ({ input }) => {
      const { type, wpm, accuracy, wordcount, userId, punctuation, numbers } = input;
      const leaderboardEntry = await prisma.leaderboard.create({
        data: {
          type,
          wpm,
          accuracy,
          wordcount,
          userId,
          punctuation,
          numbers,
        },
      });

      return { success: true, leaderboardEntry };
    }),
});
