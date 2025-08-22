import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"]),
  users: defineTable({
    isAdmin: v.optional(v.boolean()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    // phone: v.optional(v.string()),
    // phoneVerificationTime: v.optional(v.number()),
    githubId: v.optional(v.string()),
  })
    .index("email", ["email"])
});
