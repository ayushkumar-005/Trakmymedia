// This API route handles user signup (creating new accounts)
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// POST /api/auth/signup
// This function runs when someone submits the signup form
export async function POST(request: Request) {
    try {
        // Step 1: Extract data from the request body
        // The signup form sends JSON like: { "email": "john@example.com", "password": "secret123", "name": "John" }
        const body = await request.json();
        const { username, email, password, name } = body;

        // Step 2a: Validate input (check if required fields are provided)
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "Username, email, and password are required" },
                { status: 400 } // Bad Request
            );
        }

        // Step 2b: Validate username format
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            return NextResponse.json(
                {
                    error: "Username must be 3-20 characters (letters, numbers, underscore only)",
                },
                { status: 400 }
            );
        }

        // Step 3: Validate email format (simple check)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Step 4: Validate password strength (at least 6 characters)
        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        const existingUsername = await prisma.user.findUnique({
            where: { username: username.toLowerCase() },
        });

        // If username is taken, return error with HTTP 409 (Conflict)
        if (existingUsername) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 409 } // 409 = Conflict (resource already exists)
            );
        }

        // Step 6: Check if email already exists in database
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }, // Store emails in lowercase for consistency
        });

        // If user exists, return error
        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 409 } // 409 = Conflict (resource already exists)
            );
        }

        // Step 7: Hash the password using bcrypt
        // bcrypt.hash(plainTextPassword, saltRounds)
        // saltRounds = 10 means the algorithm runs 2^10 = 1024 times (more = slower but more secure)
        const passwordHash = await bcrypt.hash(password, 10);

        // Step 8: Create new user in database
        const newUser = await prisma.user.create({
            data: {
                username: username.toLowerCase(), // Lowercase for case-insensitive lookup
                email: email.toLowerCase(), // Store in lowercase
                passwordHash: passwordHash, // Store the hashed password (NOT the plain text!)
                name: name.trim(), // Optional display name (remove extra spaces)
            },
        });

        // Step 9: Return success response (don't send back the passwordHash!)
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
            },
            { status: 201 } // HTTP 201 Created
        );
    } catch (error) {
        // If anything goes wrong (database error, etc.), log it and return error
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 } // 500 = Internal Server Error
        );
    }
}
