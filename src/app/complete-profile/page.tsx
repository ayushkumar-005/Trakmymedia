"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CompleteProfilePage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if already complete or not authenticated
    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (session?.user?.profileComplete === true) {
            router.push("/");
        }
    }, [session, status, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validate passwords match
        if (password && password !== confirmPassword) {
            setError("Passwords don't match");
            setLoading(false);
            return;
        }

        try {
            // Update profile in database
            const res = await fetch("/api/auth/complete-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password: password || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to complete profile");
                setLoading(false);
                return;
            }

            console.log("✅ Profile completed!");

            // ✅ THE FIX: Set a temporary flag in localStorage
            // This tells ConditionalNavbar "don't redirect me back, I just completed setup"
            localStorage.setItem("profileJustCompleted", "true");

            // Now redirect - the flag will prevent the loop
            window.location.href = "/";
        } catch (err) {
            console.error("Complete profile error:", err);
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen grid grid-cols-1 lg:grid-cols-[45%_55%]">
            <div className="hidden lg:flex bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 p-12 flex-col justify-center relative overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-md">
                    <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
                        🎬 Trakmymedia
                    </h1>
                    <p className="text-white/90 text-xl leading-relaxed">
                        Just one more step to complete your account!
                    </p>
                    <div className="mt-12 space-y-4 text-white/80">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">✨</span>
                            <span>Choose your unique username</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🔒</span>
                            <span>
                                Optionally set a password for email login
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🚀</span>
                            <span>Start tracking immediately</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
                <div className="w-full max-w-md">
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-3xl font-bold">🎬 Trakmymedia</h1>
                        <p className="text-muted-foreground mt-2">
                            Complete your profile
                        </p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold">
                            Welcome, {session?.user?.name || "there"}!
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Let's finish setting up your account
                        </p>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium mb-1.5"
                            >
                                Username{" "}
                                <span className="text-destructive">*</span>
                            </label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="johndoe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                minLength={3}
                                maxLength={20}
                                pattern="[a-zA-Z0-9_]+"
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                3-20 characters, letters/numbers/underscore only
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium mb-1.5"
                            >
                                Password{" "}
                                <span className="text-muted-foreground text-xs">
                                    (optional)
                                </span>
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Set this if you want to login with email too
                            </p>
                        </div>

                        {password && (
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium mb-1.5"
                                >
                                    Confirm Password
                                </label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required={!!password}
                                    disabled={loading}
                                />
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Completing..." : "Complete Setup"}
                        </Button>
                    </form>

                    <p className="text-center text-xs text-muted-foreground mt-6">
                        You can always login with Google. Setting a password is
                        optional.
                    </p>
                </div>
            </div>
        </main>
    );
}
