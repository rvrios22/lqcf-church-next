import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pastorMessage").order("desc").first();
  },
});

export const update = mutation({
  args: {
    id: v.id("pastorMessage"),
    message: v.string(),
    author: v.string(),
    coramDeo: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...content } = args;
    await ctx.db.patch(id, content);
  },
});
