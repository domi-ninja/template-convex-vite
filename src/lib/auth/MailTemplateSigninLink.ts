import siteConfig from "../../../site-config";

export default function SigninLinkMail(params: {
    url: string;
    email: string;
    dateExpires: Date;
    isSignUp?: boolean;
}) {
    const isSignUpMode = params.isSignUp ?? false;
    const actionText = isSignUpMode ? "Sign up" : "Sign in";
    const titleText = isSignUpMode ? `Welcome to ${siteConfig.siteName}` : `Sign in code for ${siteConfig.siteName}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titleText}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f9fafb;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                            <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #4F46E5; text-decoration: none;">
                                ${siteConfig.siteName}
                            </h1>
                            <p style="margin: 8px 0 0; font-size: 16px; color: #6B7280;">
                                Website Monitoring Made Simple
                            </p>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 24px; font-size: 24px; font-weight: 600; color: #111827; text-align: center;">
                                ${isSignUpMode ? "Complete your account setup" : `Sign in to your account as ${params.email}`}
                            </h2>

                            <p style="margin: 0 0 32px; font-size: 16px; color: #4B5563; text-align: center; line-height: 1.5;">
                                ${isSignUpMode
            ? `Click the button below to complete your ${siteConfig.siteName} account setup. This link will expire in 24 hours for your security.`
            : `Click the button below to securely sign in to your ${siteConfig.siteName}. This link will expire in 24 hours for your security.`
        }
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="${params.url}"
                                           style="display: inline-block; padding: 16px 32px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; line-height: 1; border: none; cursor: pointer; transition: background-color 0.2s ease;"
                                           onmouseover="this.style.backgroundColor='#4338CA'"
                                           onmouseout="this.style.backgroundColor='#4F46E5'">
                                            ${actionText} to ${siteConfig.siteName}
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Alternative Link -->
                            <p style="margin: 32px 0 0; font-size: 14px; color: #6B7280; text-align: center; line-height: 1.5;">
                                If the button doesn't work, you can copy and paste this link into your browser:
                            </p>
                            <p style="margin: 8px 0 0; font-size: 14px; text-align: center; word-break: break-all;">
                                <a href="${params.url}" style="color: #4F46E5; text-decoration: underline;">${params.url}</a>
                            </p>
                        </td>
                    </tr>

                    <!-- Security Notice -->
                    <tr>
                        <td style="padding: 0 40px 40px;">
                            <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 16px;">
                                <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #92400E;">
                                    🔒 Security Notice
                                </h3>
                                <p style="margin: 0; font-size: 14px; color: #92400E; line-height: 1.4;">
                                    This ${isSignUpMode ? "sign-up" : "sign-in"} link expires on <strong>${params.dateExpires.toLocaleString()}</strong>. If you didn't request this ${isSignUpMode ? "sign-up" : "sign-in"} link, you can safely ignore this email.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 8px; font-size: 14px; color: #6B7280;">
                                Questions? Contact us at
                                <a href="mailto:${siteConfig.siteContactEmail}" style="color: #4F46E5; text-decoration: none;">
                                    ${siteConfig.siteContactEmail}
                                </a>
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                                © ${new Date().getFullYear()} ${siteConfig.siteName}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const text = `
${titleText}

${isSignUpMode
            ? `Click the link below to complete your ${siteConfig.siteName} account setup:`
            : `Click the link below to securely sign in to your account as ${params.email}:`
        }
${params.url}

This link expires at ${params.dateExpires.toLocaleString()}.

If you didn't request this ${isSignUpMode ? "sign-up" : "sign-in"} link, you can safely ignore this email.

Questions? Contact us at ${siteConfig.siteContactEmail}

© ${new Date().getFullYear()} ${siteConfig.siteName}. All rights reserved.
    `;

    return {
        html,
        text,
    }
}
