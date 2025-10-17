"use client";

import Link from "next/link"; // In-app navigation (no full page reloads)
import { useRouter } from "next/navigation"; // push URLs from code
import { useEffect, useRef, useState } from "react"; // React hooks
import {
    Menu,
    Search,
    Film,
    Tv,
    BookText,
    Gamepad2,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"; // shacn UI primitives
import ActiveNavLink from "@/components/ActiveNavLink"; // Pulls ActiveNavLink

/* Mobile Bottom Sheet Menu */
function MobileNav({
    navItems,
}: {
    navItems: { name: string; href: string; icon: React.ComponentType<any> }[];
}) {
    const router = useRouter();
    // State: Controls whether sheet is visible
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/*  Trigger: Opens sheet when hamburger is clicked */}
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open menu"
                    className="md:hidden"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>

            {/* Sheet Content */}
            <SheetContent
                side="bottom"
                className="
          inset-x-0 bottom-0 h-[85dvh] sm:h-[80dvh]
          rounded-t-2xl border-t bg-background
          p-4 pb-[max(1rem,env(safe-area-inset-bottom))]
        "
            >
                <SheetTitle className="sr-only">Main menu</SheetTitle>
                <SheetDescription className="sr-only">
                    Navigate
                </SheetDescription>

                {/* Drag Handle */}
                <div className="mx-auto mb-3 mt-1 h-1.5 w-12 rounded-full bg-border" />

                {/* Profile Link*/}
                <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-3 py-3"
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="User"
                        />
                        <AvatarFallback>TM</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                            Your Profile
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                            View your stats
                        </p>
                    </div>
                    <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                </Link>

                {/* Nav list */}
                <nav className="mt-5 grid">
                    {navItems.map(({ name, href, icon: Icon }) => (
                        // Tapping a nav item: closes the sheet and pushes the route
                        <button
                            key={name}
                            onClick={() => {
                                setOpen(false);
                                router.push(href);
                            }}
                            className="
                flex items-center gap-3 rounded-xl px-3 py-3 text-left
                hover:bg-white/5 focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
              "
                        >
                            <span className="grid size-9 place-items-center rounded-lg bg-card border border-border/60">
                                <Icon className="h-4 w-4" />
                            </span>
                            <span className="text-base font-medium">
                                {name}
                            </span>
                            <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                        </button>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}

/* Main Navbar */
export function Navbar() {
    const router = useRouter();

    // Desktop & Mobile search state handlers (Icon stays visible on mobile)
    const [searchOpen, setSearchOpen] = useState(false);
    const [q, setQ] = useState("");
    const searchRef = useRef<HTMLDivElement>(null);

    // Close desktop search when clicking outside
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (
                searchRef.current &&
                !searchRef.current.contains(e.target as Node)
            ) {
                setSearchOpen(false);
            }
        }
        if (searchOpen) document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [searchOpen]);

    // Submit search: navigate to /search?q=...
    const runSearch = () => {
        const query = q.trim();
        if (!query) return;
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setSearchOpen(false);
        setQ("");
    };
    const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") runSearch();
        if (e.key === "Escape") setSearchOpen(false);
    };

    // Nav Items: Used by both mobile and desktop
    const navItems = [
        { name: "Movies", href: "/movies", icon: Film },
        { name: "TV Shows", href: "/tv", icon: Tv },
        { name: "Books", href: "/books", icon: BookText },
        { name: "Games", href: "/games", icon: Gamepad2 },
    ];

    return (
        <>
            {/*  Bar shell & layout: When scrolled stays sticky with blurred bg */}
            <nav
                className="
          sticky top-0 z-50 w-full
          bg-[rgb(16_16_16/0.90)] backdrop-blur
          supports-[backdrop-filter]:bg-[rgb(16_16_16/0.70)]
        "
                aria-label="Global"
            >
                <div className="max-w-7xl mx-auto h-14 md:h-16 px-4 md:px-6 lg:px-8">
                    <div className="flex h-full items-center justify-between gap-3">
                        {/* Left: Hamburger (mobile) + Brand + Desktop nav */}
                        <div className="flex items-center gap-2 md:gap-4 min-w-0">
                            <MobileNav navItems={navItems} />{" "}
                            {/* Brand: always visible */}
                            <Link href="/" className="flex items-center">
                                <span className="text-lg font-semibold md:text-2xl md:font-bold md:tracking-wide md:uppercase">
                                    Trakmymedia
                                </span>
                            </Link>
                            {/* Desktop Nav */}
                            <div className="hidden md:flex items-center gap-6 ml-4">
                                {navItems.map((i) => (
                                    <ActiveNavLink key={i.name} href={i.href}>
                                        {i.name}
                                    </ActiveNavLink>
                                ))}
                            </div>
                        </div>

                        {/* Right: Search icon (mobile & desktop) + Avatar */}
                        <div className="flex items-center gap-1.5 md:gap-2">
                            {/* Desktop: icon -> inline input */}
                            <div className="hidden md:block" ref={searchRef}>
                                {!searchOpen ? (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Open search"
                                        aria-expanded={searchOpen}
                                        onClick={() => setSearchOpen(true)}
                                        className="h-9 w-9"
                                    >
                                        <Search className="h-5 w-5" />
                                    </Button>
                                ) : (
                                    <div className="relative w-[260px] lg:w-[320px]">
                                        <Input
                                            autoFocus
                                            value={q}
                                            onChange={(e) =>
                                                setQ(e.target.value)
                                            }
                                            onKeyDown={onKey}
                                            placeholder="Search movies, TV, books, games…"
                                            className="pr-10"
                                            aria-label="Search"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full hover:bg-transparent"
                                            onClick={runSearch}
                                            aria-label="Run search"
                                        >
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile: search icon toggles a row under navbar (icon stays visible) */}
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Open search"
                                onClick={() => setSearchOpen((v) => !v)}
                                className="h-9 w-9 md:hidden"
                            >
                                <Search className="h-5 w-5" />
                            </Button>

                            {/* Profile Avatar */}
                            <Link href="/profile" aria-label="Your profile">
                                <Avatar className="h-9 w-9 ring-2 ring-transparent hover:ring-primary transition">
                                    <AvatarImage
                                        src="https://github.com/shadcn.png"
                                        alt="User"
                                    />
                                    <AvatarFallback>TM</AvatarFallback>
                                </Avatar>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile search row (below navbar) */}
            {searchOpen && (
                <div className="md:hidden border-b border-border bg-background">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <div className="relative">
                            <Input
                                autoFocus
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                onKeyDown={onKey}
                                placeholder="Search movies, TV, books, games…"
                                className="pr-10"
                                aria-label="Search"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full hover:bg-transparent"
                                onClick={runSearch}
                                aria-label="Run search"
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
