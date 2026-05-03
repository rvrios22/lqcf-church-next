import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("monthEvents").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("monthEvents", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("monthEvents"),
    title: v.string(),
    description: v.string(),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...content } = args;
    await ctx.db.patch(id, content);
  },
});

export const remove = mutation({
  args: { id: v.id("monthEvents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
