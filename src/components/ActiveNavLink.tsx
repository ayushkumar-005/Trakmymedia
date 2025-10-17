"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Props
type ActiveNavLinkProps = {
    href: string; // where the link goes
    children: ReactNode; // link text/icon
    className?: string; // extra classes that might be passed in
    match?: "prefix" | "exact"; // how to decide 'active' (default: "prefix")
};

export default function ActiveNavLink({
    href,
    children,
    className,
    match = "prefix",
}: ActiveNavLinkProps) {
    // Grab the current path
    const pathname = usePathname() ?? "/";

    // Decide if it’s active
    const isActive =
        match === "exact"
            ? pathname === href
            : pathname === href || pathname.startsWith(href + "/");

    // Styles
    const base =
        "inline-flex items-center h-9 px-3 rounded-md text-sm font-medium transition-colors";
    const inactive =
        "text-muted-foreground hover:text-foreground hover:bg-white/10";
    const active = "bg-white text-black shadow-xs";

    // Render the Link
    return (
        <Link
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
                base,
                isActive ? active : inactive,
                // accessible focus ring that respects your tokens
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                className
            )}
        >
            {children}
        </Link>
    );
}
