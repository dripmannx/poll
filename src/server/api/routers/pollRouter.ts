import dayjs from "dayjs";
import { customAlphabet, nanoid } from "nanoid";
import superjson from "superjson";
import { number, z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
export const pollRouter = createTRPCRouter({
  getAllPollsByCreatedAt: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.poll.findMany({
      orderBy: { createdAt: "asc" },
      include: { choices: true },
    });
  }),
  getPollById: publicProcedure
    .input(z.object({ id: z.string() }))

    .query(({ ctx, input }) => {
      return ctx.prisma.poll.findUniqueOrThrow({
        where: { link: input.id },
        include: { choices: { include: { votes: true } } },
      });
    }),
  createPoll: publicProcedure
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
          question: input.question,
          public: true,
          discription: input.discription || "",
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

      console.log(createdLink);
      return { link: createdLink };
    }),
});
