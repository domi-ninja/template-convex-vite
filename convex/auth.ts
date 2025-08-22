import GitHub from "@auth/core/providers/github";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import ScalewayEmailAuth from "../src/lib/auth/ScalewayEmailAuth";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    ScalewayEmailAuth({
      maxAge: 24 * 60 * 60,
    }),
    GitHub,
    Password({ id: "password-link", verify: ScalewayEmailAuth }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      // Override the default user creation to handle null emails from GitHub OAuth
      const { existingUserId, profile } = args;

      if (existingUserId) {
        // Update existing user, making sure email can be null
        const userData: any = {
          name: profile.name ?? profile.email ?? "Anonymous",
          image: profile.image,
        };

        // Only set email if it's not null
        if (profile.email !== null && profile.email !== undefined) {
          userData.email = profile.email;
        }

        await ctx.db.patch(existingUserId, userData);
        return existingUserId;
      } else {
        // Create new user, making sure email can be null
        const userData: any = {
          name: profile.name ?? profile.email ?? "Anonymous",
          image: profile.image,
        };

        // Only set email if it's not null
        if (profile.email !== null && profile.email !== undefined) {
          userData.email = profile.email;
        }

        return await ctx.db.insert("users", userData);
      }
    },
  },
});
