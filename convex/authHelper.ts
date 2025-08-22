import { v } from "convex/values";
import { action } from "./_generated/server";

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
