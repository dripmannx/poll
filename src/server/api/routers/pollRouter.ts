import dayjs from "dayjs";
import { customAlphabet, nanoid } from "nanoid";
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
        where: { id: input.id },
      });
    }),
  createPoll: publicProcedure
    .input(
      z.object({
        question: z.string(),
        public: z.boolean(),
        expire: z.date().optional(),
        choices: z.object({ choicesText: z.string() }).array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const now = dayjs();
      const b = now.add(10, "years");

      const link2 = customAlphabet(
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
        8
      );
      await ctx.prisma.poll.create({
        data: {
          link: link2(),
          question: input.question,
          public: input.public,
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
    }),
});
