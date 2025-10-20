// This file configures NextAuth.js for our app
import NextAuth from "next-auth"; // Pulls NextAuth library
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// NextAuth configuration object
export const { handlers, signIn, signOut, auth } = NextAuth({
    // Secret key to encrypt sessions and JWT tokens
    secret: process.env.AUTH_SECRET,
    // Adapter: Connects NextAuth to our Prisma database
    // This tells NextAuth: "Store accounts and sessions in PostgreSQL"
    adapter: PrismaAdapter(prisma),

    // Session strategy: How we track logged-in users
    // "jwt" = Store session data in a cookie (fast, scalable)
    // Alternative: "database" = Store sessions in PostgreSQL (more secure, but slower)
    session: {
        strategy: "jwt", // Using JWT tokens for sessions
        maxAge: 30 * 24 * 60 * 60, // Session expires after 30 days
    },

    // Pages: Custom login/signup URLs
    pages: {
        signIn: "/login", // Where to redirect if user needs to log in
    },

    // Providers: How users can authenticate
    providers: [
        // Provider 1: Email + Password (Credentials)
        CredentialsProvider({
            name: "Email and Password", // Display name
            credentials: {
                emailOrUsername: {
                    label: "Email or Username", // Field label
                    type: "text", // HTML input type (text allows email OR username)
                },
                password: {
                    label: "Password",
                    type: "password", // Hides characters as user types
                },
            },

            // authorize: This function runs when someone tries to log in
            async authorize(credentials) {
                // Step 1: Validate input
                if (!credentials?.emailOrUsername || !credentials?.password) {
                    throw new Error("Email/username and password are required");
                }

                const input = credentials.emailOrUsername as string;

                // Step 2: Find user in database by email or username
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: input.toLowerCase() }, // Check email field
                            { username: input.toLowerCase() }, // Check username field
                        ],
                    },
                });

                // Step 3: If user doesn't exist, reject login
                if (!user) {
                    throw new Error(
                        "No user found with this email or username"
                    );
                }

                // Step 4: Check if password matches (using bcrypt)
                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string, // Plain text password from login form
                    user.passwordHash // Hashed password from database
                );

                // Step 5: If password is wrong, reject login
                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                // Step 6: Success! Return user data
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.avatarUrl,
                };
            },
        }),

        // Provider 2: Google OAuth (Sign in with Google)
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!, // From Google Cloud Console
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // From Google Cloud Console
        }),
    ],

    // Callbacks: Customize what happens at key moments
    callbacks: {
        // jwt: Runs when creating/updating JWT token
        async jwt({ token, user }) {
            // When user first logs in, add their ID to the token
            if (user) {
                token.id = user.id;
            }
            return token;
        },

        // session: Runs when creating/updating session object
        async session({ session, token }) {
            // Add user ID to session so we can access it in our app
            if (token && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
});
