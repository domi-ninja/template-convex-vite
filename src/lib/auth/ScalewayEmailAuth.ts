import { EmailConfig, EmailUserConfig } from "@auth/core/providers";
import { alphabet, generateRandomString } from "oslo/crypto";
import siteConfig from "../../../site-config";
import SigninLinkMail from "./MailTemplateSigninLink";

/** @todo Document this */
export default function ScalewayEmailAuth(config: EmailUserConfig): EmailConfig {
  return {
    id: "scaleway",
    type: "email",
    name: "Scaleway",
    from: siteConfig.siteContactEmail,
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params) {

      console.log("sendVerificationRequest", params);

      // Record start time to ensure consistent timing
      const startTime = Date.now();

      const projectId = process.env.SCALEWAY_PROJECT_ID;
      const apiKey = process.env.SCALEWAY_SECRET_KEY;
      const fromEmail = siteConfig.siteContactEmail;

      const token = generateRandomString(16, alphabet("0-9", "a-z"));
      const dateExpires = new Date(Date.now() + config.maxAge!);
      const recipientMail = params.identifier;

      if (!process.env.SCALEWAY_SECRET_KEY || !process.env.SCALEWAY_PROJECT_ID) {
        console.log(`Would send email ${token} to ${recipientMail} (expires: ${dateExpires.toLocaleString()})`);
        console.log("Set SCALEWAY_SECRET_KEY and SCALEWAY_PROJECT_ID to send real emails");
      } else {
        const mail = SigninLinkMail({
          url: params.url,
          dateExpires: dateExpires,
          recipientMail,
        });

        const response = await fetch("https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails", {
          method: "POST",
          headers: {
            "X-Auth-Token": apiKey as string,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_id: projectId,
            from: {
              email: fromEmail,
              name: config.name,
            },
            to: [{
              email: recipientMail,
            }],
            subject: `Login to ${siteConfig.siteName}`,
            html: mail.html,
            text: mail.text,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error("Scaleway email error:", error);
          throw new Error(`Failed to send email: ${error}`);
        }

        console.log(`Login code sent to ${recipientMail}`);
      }

      // Ensure the function always takes roughly 1 second to prevent timing attacks
      const elapsedTime = Date.now() - startTime;
      const targetTime = 1000; // 1 second
      const remainingTime = Math.max(0, targetTime - elapsedTime);

      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
    },
    options: config,
  }
}
