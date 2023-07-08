import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const pollRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.vote.findMany();
  }),
});
