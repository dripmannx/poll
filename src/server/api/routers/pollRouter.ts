import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
export const pollRouter = createTRPCRouter({
  getAllPollsByCreatedAt: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.poll.findMany({
      orderBy: { createdAt: "asc" },
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const now = dayjs();
      const b = now.add(10, "years");
      const link = nanoid(9);
      await ctx.prisma.poll.create({
        data: {
          link: link,
          question: input.question,
          public: input.public,
          expiredAt: input.expire ? input.expire : b.toDate(),
          willExpire: input.expire ? false : true,
        },
      });
    }),
});
