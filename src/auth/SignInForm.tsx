import { SignInMethodDivider } from "@/auth/SignInMethodDivider";
import { SignInWithOAuth } from "@/auth/SignInWithOAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useAuthActions } from "@convex-dev/auth/react";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";


export function SignInForm() {
  const [step, setStep] = useState<"signIn" | "signUp" | "linkSent">("signIn");
  const hasOauthsAction = useAction(api.authHelper.hasOauths);
  const [hasOauths, setHasOauths] = useState(false);

  useEffect(() => {
    const checkOauths = async () => {
      const hasOauths = await hasOauthsAction();
      setHasOauths(hasOauths);
    };
    void checkOauths();
  }, [hasOauthsAction]);

  return (
    <div className="max-w-[384px] mx-auto flex flex-col gap-4 bg-background p-4 rounded-lg">
      {step === "signIn" || step === "signUp" ? (
        <>
          <h2 className="font-semibold text-2xl tracking-tight text-center">
            {step === "signIn" ? "Welcome back" : "Create an account"}
          </h2>
          {hasOauths && (
            <>
              <SignInWithOAuth />
              <SignInMethodDivider />
            </>
          )}
          <SignInWithMagicLink
            mode={step}
            handleLinkSent={() => setStep("linkSent")}
          />
          <div className="text-center text-sm">
            {step === "signIn" ? (
              <span>
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => setStep("signUp")}
                >
                  Create account
                </Button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => setStep("signIn")}
                >
                  Login
                </Button>
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="font-semibold text-2xl tracking-tight">
            Check your email
          </h2>
          <p>A sign-in link has been sent to your email address.</p>
          <Button
            className="p-0 self-start"
            variant="link"
            onClick={() => setStep("signIn")}
          >
            Cancel
          </Button>
        </>
      )}
      <Toaster />
    </div>
  );
}

function SignInWithMagicLink({
  mode,
  handleLinkSent,
}: {
  mode: "signIn" | "signUp";
  handleLinkSent: () => void;
}) {

  const { signIn } = useAuthActions();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;

        // Validate email
        if (!email || !validateEmail(email)) {
          toast({
            title: "Please enter a valid email address",
            variant: "destructive",
          });
          return;
        }

        setSubmitting(true);

        // Add the flow parameter to distinguish between sign-in and sign-up
        formData.append("flow", mode === "signUp" ? "signUp" : "signIn");

        signIn("scaleway", formData)
          .then(handleLinkSent)
          .catch((error) => {
            console.error(error);
            toast({
              title: `Could not send ${mode === "signUp" ? "sign-up" : "sign-in"} link`,
              variant: "destructive",
            });
            setSubmitting(false);
          });
      }}
    >
      <label className="text-sm pb-2" htmlFor="email">Email</label>
      <Input
        name="email"
        id="email"
        type="email"
        required
        className="mb-4"
        autoComplete="email"
        placeholder="Enter your email address"
      />
      <Button type="submit" disabled={submitting}>
        {mode === "signUp" ? "Sign Up" : "Sign In"}
      </Button>

    </form>
  );
}
