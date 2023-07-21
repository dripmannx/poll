import { TRPCError } from "@trpc/server";
import { privateDecrypt } from "crypto";
import dayjs from "dayjs";
import { customAlphabet, nanoid } from "nanoid";
import superjson from "superjson";
import { number, z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
export const pollRouter = createTRPCRouter({
  getAllPublicPollsByCreatedAt: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.poll.findMany({
      orderBy: { createdAt: "asc" },
      include: { choices: true },
    });
  }),
  getPollById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.poll
        .findUniqueOrThrow({
          where: { link: input.id },
          include: { choices: { include: { votes: true } } },
        })
        .catch(() => {
          throw new TRPCError({
            message: "Umfrage Existiert nicht",
            code: "INTERNAL_SERVER_ERROR",
          });
        });
    }),
  getPollByUserId: privateProcedure.query(({ ctx, input }) => {
    const polls = ctx.prisma.poll.findMany({
      where: { userId: ctx.userId },
      include: { choices: { include: { votes: true } } },
    });

    return polls;
  }),
  createPoll: privateProcedure
    .input(
      z.object({
        question: z.string(),
        expire: z.date().optional(),
        choices: z.object({ choicesText: z.string() }).array(),
        discription: z.string().optional(),
      })
    )
    .output(
      z.object({
        link: z.string(),
        question: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const now = dayjs();
      const b = now.add(10, "years");
      const AlphabetString =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const link = customAlphabet(AlphabetString, 8);
      const createdLink = link();

      await ctx.prisma.poll.create({
        data: {
          link: createdLink,
          userId: ctx.userId,
          question: input.question,

          discription: input.discription,
          expiredAt: input.expire ? input.expire : b.toDate(),
          willExpire: input.expire ? false : true,
          choices: {
            createMany: {
              data: input.choices.map((choice) => ({
                choiceText: choice.choicesText,
              })),
            },
          },
        },
      });

      return { question: input.question, link: createdLink };
    }),
  createVote: privateProcedure
    .input(
      z.object({
        id: z.string(),
        pollId: z.string(),
      })
    )
    .output(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const poll = await ctx.prisma.poll.findUnique({
        where: { id: input.pollId },
      });
      if (!poll) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Umfrage existiert nicht",
        });
      }

      // Check if the user has already voted for the poll
      const existingVote = await ctx.prisma.vote.findFirst({
        where: {
          pollId: input.pollId,
          userId: ctx.userId,
        },
      });

      if (existingVote) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Du hast bereits abgestimmt",
        });
      }
      await ctx.prisma.vote.create({
        data: {
          userId: ctx.userId,
          choiceId: input.id,
          pollId: input.pollId,
        },
      });

      return { id: input.id };
    }),

  getVotesByPollId: privateProcedure
    .input(z.object({ pollId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.poll
        .findMany({
          where: { link: input.pollId },
          include: { choices: { include: { votes: true } } },
        })
        .catch(() => {
          throw new TRPCError({
            message: "Umfrage Existiert nicht",
            code: "INTERNAL_SERVER_ERROR",
          });
        });
    }),
});
