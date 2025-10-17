import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar"; // Pulls navbar

// Default page title and description for the whole app (can be overridden per page)
export const metadata: Metadata = {
    title: "Trakmymedia",
    description: "Your personal media tracker",
};

// Global layout
export default function RootLayout({
    children,
}: {
    children: React.ReactNode; // TypeScript for “this prop can render any React content”
}) {
    return (
        <html lang="en">
            <body className="min-h-dvh antialiased bg-background text-foreground">
                <Navbar />
                {children} {/* Whatever page/route is being shown right now  */}
            </body>
        </html>
    );
}
