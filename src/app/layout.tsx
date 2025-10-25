import "./globals.css";
import type { Metadata } from "next";
import { ConditionalNavbar } from "@/components/ConditionalNavbar"; // Handles navbar visibility
import { Providers } from "@/components/Providers"; // Pulls session provider

// Default page title and description for the whole app (can be overridden per page)
export const metadata: Metadata = {
    title: "Trakmymedia",
    description: "Your personal media tracker",
};

// Global layout (server component)
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-dvh antialiased bg-background text-foreground">
                <Providers>
                    <ConditionalNavbar />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
