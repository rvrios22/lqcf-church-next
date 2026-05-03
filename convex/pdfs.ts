import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByStudy = query({
  args: { studyId: v.id("studies") },
  handler: async (ctx, args) => {
    const pdfs = await ctx.db
      .query("pdfs")
      .withIndex("by_studyId", (q) => q.eq("studyId", args.studyId))
      // Since studyId is the index, we sort the resulting collection manually
      // or use a composite index. For small sets, manual sort is fine:
      .collect();

    const sortedPdfs = pdfs.sort((a, b) => a.date - b.date);

    return await Promise.all(
      sortedPdfs.map(async (pdf) => ({
        ...pdf,
        url: await ctx.storage.getUrl(pdf.storageId),
      })),
    );
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const savePdfRecord = mutation({
  args: {
    title: v.string(),
    storageId: v.id("_storage"),
    studyId: v.id("studies"),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("pdfs", args);
  },
});

export const remove = mutation({
  args: {
    id: v.id("pdfs"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // 1. Remove the binary file from Convex Storage
    await ctx.storage.delete(args.storageId);

    // 2. Remove the document from the pdfs table
    await ctx.db.delete(args.id);
  },
});
