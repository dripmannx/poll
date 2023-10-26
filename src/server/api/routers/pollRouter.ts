import { useAuth } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { privateDecrypt } from "crypto";
import dayjs from "dayjs";
import { AwardIcon } from "lucide-react";
import { customAlphabet, nanoid } from "nanoid";
import { copyTracedFiles } from "next/dist/build/utils";
import superjson from "superjson";
import { number, z } from "zod";
import useClerkQuery from "~/components/getAuthToken";

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
  getUserAccessToken: privateProcedure.query(async ({ ctx, input }) => {

    const resp = await fetch(`https://api.clerk.com/v1/users/${ctx.userId}/oauth_access_tokens/oauth_spotify`,
      { mode: "no-cors", headers: { Authorization: `Bearer ${ctx.token}`, } }).then(res => res.json().then(res => res));


    return { resp }
  }),
  getPollByUserIdWithCount: privateProcedure.query(async ({ ctx, input }) => {
    const pollsWithUniqueVotersCount = await ctx.prisma.poll.findMany({
      where: { userId: ctx.userId },
      select: {
        id: true,
        question: true,
        choices: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        isMultipleChoice: true,
        discription: true,
        expiredAt: true,
        willExpire: true,
        link: true,
        Vote: {
          select: {
            userId: true,
          },
        },
      },
    });

    const pollsWithVotesCount = pollsWithUniqueVotersCount.map((poll) => ({
      pollInfo: poll,
      uniqueVotersCount: new Set(poll.Vote.map((vote) => vote.userId)).size,
    }));

    return pollsWithVotesCount;
  }),
  createPoll: privateProcedure
    .input(
      z.object({
        question: z.string(),
        expire: z.date().optional(),
        choices: z.object({ choicesText: z.string() }).array(),
        discription: z.string().optional(),
        isMultipleChoice: z.boolean(),
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
          expiredAt: input.expire === undefined ? undefined : input.expire,
          willExpire: input.expire === undefined ? false : true,
          isMultipleChoice: input.isMultipleChoice,
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
        choicesIds: z.string().array(),
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
      const now = new Date();
      if (now > poll.expiredAt && poll.willExpire) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Diese Umfrage ist abgelaufen",
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

      await ctx.prisma.vote.createMany({
        data: input.choicesIds.map((id) => ({
          choiceId: id,
          pollId: input.pollId,
          userId: ctx.userId,
        })),
      });

      return { id: poll.link };
    }),

  getVotesByPollId: privateProcedure
    .input(z.object({ pollId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.poll
        .findUniqueOrThrow({
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
  deletePoll: privateProcedure
    .input(
      z.object({
        pollId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isCreator = ctx.prisma.vote.findFirst({
        where: { pollId: input.pollId, userId: ctx.userId },
      });
      if (!isCreator) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Du bist nicht der Creator der Umfrage",
        });
      }
      const deletePoll = ctx.prisma.poll.delete({
        where: { id: input.pollId },
        include: { choices: { include: { votes: true } } },
      });

      return await ctx.prisma.$transaction([deletePoll]).catch((err) => {
        throw new TRPCError({
          message: "Löschen fehlgeschlagen",
          code: "INTERNAL_SERVER_ERROR",
        });
      });
    }),

  getUsersWhoVotedForPoll: privateProcedure
    .input(z.object({ pollId: z.string() }))
    .query(async ({ ctx, input }) => {
      const poll = ctx.prisma.poll
        .findUniqueOrThrow({
          where: { link: input.pollId },
        })
        .catch(() => {
          throw new TRPCError({
            message: "Umfrage Existiert nicht",
            code: "INTERNAL_SERVER_ERROR",
          });
        });

      // Getting the UserId from the Poll to Check if the Sessison User is the Creator of the poll
      const pollUserId = await poll.then((res) => res.userId);

      // Compare the userID of the Poll with the userID from the session
      if (pollUserId !== ctx.userId) {
        throw new TRPCError({
          message:
            "Access denied: You are not authorized to view this poll's votes.",
          code: "FORBIDDEN",
        });
      }
      const votes = ctx.prisma.vote
        .findMany({
          where: { pollId: input.pollId },
          select: { userId: true },
        })
        .catch(() => {
          throw new TRPCError({
            message: "Umfrage Existiert nicht",
            code: "INTERNAL_SERVER_ERROR",
          });
        });

      // If the user is authorized, return the poll
    }),
  CountUsersWhoVotedInPoll: privateProcedure
    .input(z.object({ pollId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.vote.count({
        where: {
          poll: {
            link: input.pollId,
          },
        },
        distinct: ["userId"],
      });
      // If the user is authorized, return the poll
    }),
});
