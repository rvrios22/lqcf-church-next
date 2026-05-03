import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(),
  }).index("by_email", ["email"]),

  pastorMessage: defineTable({
    author: v.string(),
    message: v.string(),
    coramDeo: v.string(),
  }),

  monthEvents: defineTable({
    title: v.string(),
    description: v.string(),
    date: v.number(),
  }).index("by_date", ["date"]),

  studies: defineTable({
    title: v.string(),
  }),

  pdfs: defineTable({
    title: v.string(),
    date: v.number(),
    storageId: v.id("_storage"),
    studyId: v.id("studies"),
  })
    .index("by_studyId", ["studyId"])
    .index("by_date", ["date"]),
});
