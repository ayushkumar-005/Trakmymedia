"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    const router = useRouter();

    // Form state (accepts email OR username)
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");

    // UI state
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle email/password login
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                emailOrUsername,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email/username or password");
                setLoading(false);
                return;
            }

            router.push("/");
            router.refresh();
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
        <main className="min-h-screen grid grid-cols-1 lg:grid-cols-[45%_55%]">
            {/* ========== LEFT SIDE: Branding (hidden on mobile) ========== */}
            <div className="hidden lg:flex bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 p-12 flex-col justify-center relative overflow-hidden">
                {/* Decorative blur circles */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-md">
                    {/* Desktop: Clickable heading */}
                    <Link href="/" className="inline-block">
                        <h1 className="text-5xl font-bold text-white mb-6 tracking-tight hover:opacity-90 transition-opacity cursor-pointer">
                            Trakmymedia
                        </h1>
                    </Link>
                    <p className="text-white/90 text-xl leading-relaxed">
                        Track everything you watch, read, and play in one place.
                    </p>
                    <div className="mt-12 space-y-4 text-white/80">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🎥</span>
                            <span>Movies & TV Shows</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📖</span>
                            <span>Books & Comics</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🎮</span>
                            <span>Video Games</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== RIGHT SIDE: Login Form ========== */}
            <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
                <div className="w-full max-w-md">
                    {/* Mobile: Clickable branding */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-block">
                            <h1 className="text-3xl font-bold hover:opacity-80 transition-opacity cursor-pointer">
                                Trakmymedia
                            </h1>
                        </Link>
                        <p className="text-muted-foreground mt-2">
                            Track your media
                        </p>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold">Welcome Back</h2>
                        <p className="text-muted-foreground mt-2">
                            Log in to continue tracking
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {/* ========== LOGIN FORM ========== */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email or Username Field */}
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
                            <span className="bg-background px-2 text-muted-foreground">
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
