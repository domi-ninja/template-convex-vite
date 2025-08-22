import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { internalQuery, mutation, query } from "./_generated/server";

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return userId !== null ? ctx.db.get(userId) : null;
  },
});

export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return ctx.db.get(args.userId);
  },
});

export const getUserAndAuthAccount = query({
  args: {},
  returns: v.any(),
  handler: async (ctx): Promise<any> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    const authAccount: Doc<"authAccounts"> | null = await ctx.runQuery(internal.users.getAuthAccountByUserId, {
      userId,
    });

    return {
      ...user,
      ...(authAccount && {
        provider: authAccount.provider,
        providerAccountId: authAccount.providerAccountId,
      }),
    };
  },
});

export const getAuthAccountByUserId = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    let authAccount = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) =>
        q.eq("userId", args.userId).eq("provider", "github")
      )
      .first();

    if (!authAccount) {
      authAccount = await ctx.db
        .query("authAccounts")
        .withIndex("userIdAndProvider", (q) =>
          q.eq("userId", args.userId).eq("provider", "email")
        )
        .first();
    }

    return authAccount;
  },
});



export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Determine provider to enforce email editability
    const authAccount = await ctx.runQuery(internal.users.getAuthAccountByUserId, { userId });
    const provider = authAccount?.provider;

    if (args.email !== undefined && provider && provider !== "email") {
      throw new Error("Email can only be updated for email provider accounts");
    }

    const updates: Record<string, any> = {};
    if (args.name !== undefined) {
      updates.name = args.name;
    }
    if (args.email !== undefined) {
      updates.email = args.email;
    }

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(userId, updates);
    }

    return null;
  },
});

// TODO delete AuthAccount as well
export const deleteAccount = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx, _args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Delete all user's data first
    const userNumbers = await ctx.db
      .query("numbers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const number of userNumbers) {
      await ctx.db.delete(number._id);
    }

    // Delete all user's data before deleting the user
    const numbers = await ctx.db
      .query("numbers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const number of numbers) {
      await ctx.db.delete(number._id);
    }

    // Finally delete the user
    await ctx.db.delete(userId);

    return null;
  },
});
