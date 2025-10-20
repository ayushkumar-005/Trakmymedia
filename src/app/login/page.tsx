"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    const router = useRouter();

    // Form state (UPDATED: Now accepts email OR username)
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");

    // UI state
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle email/password login
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); // Prevent page reload
        setError(""); // Clear previous errors
        setLoading(true); // Show loading state

        try {
            // Call NextAuth's signIn function (credentials provider)
            // UPDATED: Now sends emailOrUsername (supports both email and username)
            const result = await signIn("credentials", {
                emailOrUsername, // Changed from "email"
                password,
                redirect: false, // Don't auto-redirect, we'll handle it manually
            });

            // Check if login failed
            if (result?.error) {
                setError("Invalid email/username or password"); // Updated error message
                setLoading(false);
                return;
            }

            // Success! Redirect to home
            router.push("/");
            router.refresh(); // Refresh to update session
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    // Handle Google login
    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/" });
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Welcome Back</h1>
                    <p className="text-muted-foreground mt-2">
                        Log in to continue tracking
                    </p>
                </div>

                {/* Card */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email or Username Field (UPDATED) */}
                        <div>
                            <label
                                htmlFor="emailOrUsername"
                                className="block text-sm font-medium mb-1.5"
                            >
                                Email or Username
                            </label>
                            <Input
                                id="emailOrUsername"
                                type="text"
                                placeholder="you@example.com or johndoe"
                                value={emailOrUsername}
                                onChange={(e) =>
                                    setEmailOrUsername(e.target.value)
                                }
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium mb-1.5"
                            >
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or
                            </span>
                        </div>
                    </div>

                    {/* Google Login Button */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Log in with Google
                    </Button>

                    {/* Signup Link */}
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-primary hover:underline font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
