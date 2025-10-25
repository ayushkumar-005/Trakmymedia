"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { useEffect, useRef, useState } from "react";

// Shows/hides navbar and handles profile completion redirect
export function ConditionalNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();

    // ✅ Use a ref to prevent redirect loops
    const hasRedirected = useRef(false);

    // ✅ NEW: Check if profile was just completed (localStorage bypass)
    const [bypassCheck, setBypassCheck] = useState(false);

    // Check localStorage on component mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const justCompleted = localStorage.getItem("profileJustCompleted");
            if (justCompleted === "true") {
                console.log("✅ Profile just completed - bypassing redirect");
                setBypassCheck(true);
                // Clean up the flag immediately
                localStorage.removeItem("profileJustCompleted");
            }
        }
    }, []);

    // Redirect to complete-profile if profile is incomplete
    useEffect(() => {
        if (status === "loading") return;

        // Reset redirect flag when pathname changes
        if (pathname === "/complete-profile") {
            hasRedirected.current = false;
        }

        // DEBUG: Log session data
        console.log("🔍 ConditionalNavbar Check:", {
            status,
            email: session?.user?.email,
            profileComplete: session?.user?.profileComplete,
            username: session?.user?.username,
            pathname,
            hasRedirected: hasRedirected.current,
            bypassCheck, // NEW: log bypass status
        });

        // ✅ Skip redirect if profile was just completed
        if (bypassCheck) {
            return;
        }

        // ✅ Only redirect if profile is explicitly false and we haven't redirected yet
        if (
            status === "authenticated" &&
            session?.user &&
            session.user.profileComplete === false &&
            pathname !== "/complete-profile" &&
            !hasRedirected.current
        ) {
            console.log("🔄 Redirecting to /complete-profile");
            hasRedirected.current = true;
            router.push("/complete-profile");
        }
    }, [session, status, pathname, router, bypassCheck]);

    // Hide navbar on auth pages
    const hideNavbar =
        pathname === "/login" ||
        pathname === "/signup" ||
        pathname === "/complete-profile";

    if (hideNavbar) {
        return null;
    }

    return <Navbar />;
}
