import { Resend } from "resend";

// Initialize Resend with your API key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender address (must be verified in Resend dashboard)
// For testing, Resend provides onboarding@resend.dev
const FROM_EMAIL = "onboarding@resend.dev";

/**
 * Sends a welcome email to new users
 * @param toEmail - User's email address
 * @param userName - User's name (or username)
 */
export async function sendWelcomeEmail(
    toEmail: string,
    userName: string | null
) {
    try {
        // Send the email using Resend API
        const data = await resend.emails.send({
            from: `Trakmymedia <${FROM_EMAIL}>`, // Sender name & email
            to: [toEmail], // Recipient (must be array)
            subject: "Welcome to Trakmymedia! 🎬", // Email subject
            html: getWelcomeEmailHTML(userName || "there"), // Email body (HTML)
        });

        console.log("✅ Welcome email sent:", data);
        return { success: true, data };
    } catch (error) {
        // Log error but don't crash the signup process
        console.error("❌ Failed to send welcome email:", error);
        return { success: false, error };
    }
}

/**
 * Generates HTML for the welcome email
 * @param userName - User's name to personalize the email
 */
function getWelcomeEmailHTML(userName: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Trakmymedia</title>
</head>
<body style="
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #0f0f0f;
    color: #f5f5f5;
">
    <!-- Main Container -->
    <table role="presentation" style="
        width: 100%;
        border-collapse: collapse;
        background-color: #0f0f0f;
    ">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Email Card -->
                <table role="presentation" style="
                    max-width: 600px;
                    width: 100%;
                    background-color: #161616;
                    border: 1px solid #262626;
                    border-radius: 12px;
                    overflow: hidden;
                ">
                    <!-- Header -->
                    <tr>
                        <td style="
                            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                            padding: 40px 30px;
                            text-align: center;
                        ">
                            <h1 style="
                                margin: 0;
                                font-size: 28px;
                                font-weight: bold;
                                color: white;
                            ">
                                Trakmymedia
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="
                                margin: 0 0 20px;
                                font-size: 24px;
                                font-weight: 600;
                                color: #f5f5f5;
                            ">
                                Welcome, ${userName}! 👋
                            </h2>
                            
                            <p style="
                                margin: 0 0 20px;
                                font-size: 16px;
                                line-height: 1.6;
                                color: #a3a3a3;
                            ">
                                Thanks for joining Trakmymedia! You're now part of a community that tracks movies, TV shows, books, and games all in one place.
                            </p>
                            
                            <p style="
                                margin: 0 0 30px;
                                font-size: 16px;
                                line-height: 1.6;
                                color: #a3a3a3;
                            ">
                                Here's what you can do:
                            </p>
                            
                            <!-- Feature List -->
                            <table role="presentation" style="width: 100%; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <span style="font-size: 20px;">📺</span>
                                        <span style="
                                            margin-left: 12px;
                                            font-size: 16px;
                                            color: #f5f5f5;
                                        ">
                                            Log movies and TV shows
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <span style="font-size: 20px;">📚</span>
                                        <span style="
                                            margin-left: 12px;
                                            font-size: 16px;
                                            color: #f5f5f5;
                                        ">
                                            Track your reading list
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <span style="font-size: 20px;">🎮</span>
                                        <span style="
                                            margin-left: 12px;
                                            font-size: 16px;
                                            color: #f5f5f5;
                                        ">
                                            Keep tabs on games you play
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <span style="font-size: 20px;">⭐</span>
                                        <span style="
                                            margin-left: 12px;
                                            font-size: 16px;
                                            color: #f5f5f5;
                                        ">
                                            Rate everything
                                        </span>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="http://localhost:3000" style="
                                            display: inline-block;
                                            padding: 14px 32px;
                                            background-color: #3b82f6;
                                            color: white;
                                            text-decoration: none;
                                            border-radius: 8px;
                                            font-size: 16px;
                                            font-weight: 600;
                                        ">
                                            Start Tracking
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="
                            padding: 30px;
                            text-align: center;
                            border-top: 1px solid #262626;
                        ">
                            <p style="
                                margin: 0;
                                font-size: 14px;
                                color: #737373;
                            ">
                                Happy tracking! 🎉<br>
                                The Trakmymedia Team
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}
