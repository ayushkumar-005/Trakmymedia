// src/lib/auth.ts
// This file configures NextAuth.js for our app
import NextAuth from "next-auth";
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
    adapter: PrismaAdapter(prisma),

    // Session strategy: JWT tokens for sessions
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    // Custom pages
    pages: {
        signIn: "/login",
    },

    // Authentication providers
    providers: [
        // Email + Password
        CredentialsProvider({
            name: "Email and Password",
            credentials: {
                emailOrUsername: {
                    label: "Email or Username",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                // Validate input
                if (!credentials?.emailOrUsername || !credentials?.password) {
                    throw new Error("Email/username and password are required");
                }

                const input = credentials.emailOrUsername as string;

                // Find user by email or username
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: input.toLowerCase() },
                            { username: input.toLowerCase() },
                        ],
                    },
                });

                // User not found
                if (!user) {
                    throw new Error(
                        "No user found with this email or username"
                    );
                }

                // Check if user has password (OAuth users might not)
                if (!user.passwordHash) {
                    throw new Error(
                        "This account uses social login. Please sign in with Google."
                    );
                }

                // Verify password
                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.passwordHash
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                // Return user data
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),

        // Google OAuth
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    // Callbacks
    callbacks: {
        // jwt: Runs when creating/updating JWT token
        async jwt({ token, user, trigger, account }) {
            // Add user ID on first login
            if (user) {
                token.id = user.id;
            }

            // Fetch fresh data on sign-in
            if (trigger === "signIn" || account || user) {
                console.log("🔄 JWT: Fetching user data from database");

                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email! },
                    select: { profileComplete: true, username: true },
                });

                if (dbUser) {
                    token.profileComplete = dbUser.profileComplete;
                    token.username = dbUser.username;
                    console.log("✅ JWT: Data loaded", {
                        profileComplete: dbUser.profileComplete,
                        username: dbUser.username,
                    });
                }
            }

            return token;
        },
        // session: Runs when creating session object
        async session({ session, token }) {
            // Add custom fields to session
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.profileComplete = token.profileComplete as boolean;
                session.user.username = token.username as string | null;

                console.log("🎫 Session data:", {
                    email: session.user.email,
                    profileComplete: session.user.profileComplete,
                    username: session.user.username,
                });
            }

            return session;
        },
    },
});
