// This API route completes OAuth user profile setup
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email"; // Import email function

// POST /api/auth/complete-profile
export async function POST(request: Request) {
    try {
        // Get current session
        const session = await auth();

        // Check if user is authenticated
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Check if profile is already complete
        if (user.profileComplete) {
            return NextResponse.json(
                { error: "Profile already completed" },
                { status: 400 }
            );
        }

        // Extract data from request
        const body = await request.json();
        const { username, password } = body;

        // Validate username
        if (!username || typeof username !== "string") {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 }
            );
        }

        // Validate username format
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            return NextResponse.json(
                {
                    error: "Username must be 3-20 characters (letters, numbers, underscore only)",
                },
                { status: 400 }
            );
        }

        // Check if username is taken
        const existingUsername = await prisma.user.findUnique({
            where: { username: username.toLowerCase() },
        });

        if (existingUsername) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 409 }
            );
        }

        // Prepare update data
        const updateData: any = {
            username: username.toLowerCase(),
            profileComplete: true,
        };

        // If password provided, hash it
        if (password && typeof password === "string") {
            if (password.length < 8) {
                return NextResponse.json(
                    { error: "Password must be at least 8 characters" },
                    { status: 400 }
                );
            }

            updateData.passwordHash = await bcrypt.hash(password, 10);
        }

        // Update user in database
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
        });

        // ✅ NEW: Send welcome email after completing profile
        console.log("📧 Sending welcome email to:", updatedUser.email);
        const emailResult = await sendWelcomeEmail(
            updatedUser.email,
            updatedUser.name || updatedUser.username
        );

        // Log email result
        if (emailResult.success) {
            console.log("✅ Welcome email sent successfully!");
        } else {
            console.warn("⚠️ Profile completed but email failed to send");
            // We don't fail the request if email fails - user is still created
        }

        // Return success
        return NextResponse.json(
            {
                success: true,
                message: "Profile completed successfully",
                user: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    name: updatedUser.name,
                },
                emailSent: emailResult.success, // ✅ Tell client if email was sent
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Complete profile error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
