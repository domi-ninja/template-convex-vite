import { SignInWithGitHub } from "@/auth/oauth/SignInWithGitHub";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";

export function SignInWithOAuth() {
  const hasGithubOauthAction = useAction(api.authHelper.hasGithubOauth);
  const [hasGithubOauth, setHasGithubOauth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkGithubOauth = async () => {
      try {
        const result = await hasGithubOauthAction();
        setHasGithubOauth(result);
      } catch (error) {
        console.error("Failed to check GitHub OAuth availability:", error);
        setHasGithubOauth(false);
      } finally {
        setIsLoading(false);
      }
    };

    void checkGithubOauth();
  }, [hasGithubOauthAction]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-[460px]:flex-row w-full gap-2 items-stretch">
        <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-[460px]:flex-row w-full gap-2 items-stretch">
      {hasGithubOauth && <SignInWithGitHub />}
      {/* <SignInWithGoogle /> */}
      {/* <SignInWithApple /> */}
    </div>
  );
}
