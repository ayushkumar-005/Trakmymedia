// This API route handles user signup (creating new accounts)
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email"; // Import email function

// POST /api/auth/signup
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, email, password, name } = body;

        // Validate input
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "Username, email, and password are required" },
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

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        // Check if username exists
        const existingUsername = await prisma.user.findUnique({
            where: { username: username.toLowerCase() },
        });

        if (existingUsername) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 409 }
            );
        }

        // Check if email exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new user in database
        const newUser = await prisma.user.create({
            data: {
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                passwordHash: passwordHash,
                name: name?.trim() || null,
                profileComplete: true,
            },
        });

        // Send email AFTER user is created but BEFORE responding
        // This way we can handle email errors gracefully
        const emailResult = await sendWelcomeEmail(
            newUser.email,
            newUser.name || newUser.username
        );

        // Log email result (optional: you could return this info to client)
        if (!emailResult.success) {
            console.warn("⚠️ User created but email failed to send");
            // Note: We still continue - user is created successfully
        }

        // Return success response
        return NextResponse.json(
            {
                success: true,
                message: "Account created successfully",
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    name: newUser.name,
                },
                // Optional: tell client if email was sent
                emailSent: emailResult.success,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
