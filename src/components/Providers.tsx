"use client"; // This marks it as a Client Component

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// Props: children = all the app content (pages, navbar, etc.)
type ProvidersProps = {
    children: ReactNode;
};

// This component wraps your entire app and provides session data everywhere
export function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            {children} {/* Everything inside has access to session data */}
        </SessionProvider>
    );
}
