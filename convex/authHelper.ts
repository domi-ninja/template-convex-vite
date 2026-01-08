import { v } from "convex/values";
import { action, mutation } from "./_generated/server";

export const hasOauths = action({
  args: {},
  returns: v.boolean(),
  handler: async (_ctx) => {
    return !!(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);
  },
});


export const hasGithubOauth = action({
  args: {},
  returns: v.boolean(),
  handler: async (_ctx) => {
    return !!(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);
  },
});

export const fuck = mutation({
  args: {},
  returns: v.null(),
  handler: async (_ctx) => {

    for (const tableName of [
      "accounts",
      "authAccounts",
      "authRateLimits",
      "authRefreshTokens",
      "authSessions",
      "authVerificationCodes",
      "authVerifiers",
      "authenticators",
      "numbers",
      "sessions",
      "users",
      "verificationTokens",
    ]) {
      const items = await _ctx.db.query(tableName as any).collect();

      for (const item of items) {
        await _ctx.db.delete(item._id);
      }
    }

    return;
  },
});
