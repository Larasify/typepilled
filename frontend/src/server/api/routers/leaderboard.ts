import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const leaderboardRouter = createTRPCRouter({
  getpublicleaderboard: publicProcedure.query(async () => {
    const leaderboard15 = await prisma.leaderboard.findMany({
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
      where: {
        type: "15",
      },
      orderBy: {
        wpm: "desc",
      },
      take: 20,
    });
    const leaderboard30 = await prisma.leaderboard.findMany({
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
      where: {
        type: "30",
      },
      orderBy: {
        wpm: "desc",
      },
      take: 20,
    });

    return { leaderboard15, leaderboard30 };
  }),

  getpublicleaderboardpg2: publicProcedure.query(async () => {
    const leaderboard60 = await prisma.leaderboard.findMany({
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
      where: {
        type: "60",
      },
      orderBy: {
        wpm: "desc",
      },
      take: 20,
    });
    const leaderboard120 = await prisma.leaderboard.findMany({
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
      where: {
        type: "120",
      },
      orderBy: {
        wpm: "desc",
      },
      take: 20,
    });

    return { leaderboard60, leaderboard120 };
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
        numbers: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const { type, wpm, accuracy, wordcount, userId, punctuation, numbers } =
        input;
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
