"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react"; // Session & logout
import {
    Menu,
    Search,
    Film,
    Tv,
    BookText,
    Gamepad2,
    ChevronRight,
    LogOut,
    User,
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
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Dropdown for desktop profile menu
import ActiveNavLink from "@/components/ActiveNavLink";

/* Mobile Bottom Sheet Menu */
function MobileNav({
    navItems,
}: {
    navItems: { name: string; href: string; icon: React.ComponentType<any> }[];
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { data: session, status } = useSession(); // Get session to show/hide logout

    return (
        <Sheet open={open} onOpenChange={setOpen}>
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

                {/* Nav list - Movies, TV, Books, Games */}
                <nav className="grid">
                    {navItems.map(({ name, href, icon: Icon }) => (
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

                {/* Logout button - Only shown when authenticated */}
                {status === "authenticated" && (
                    <div className="mt-auto pt-4 border-t border-border">
                        <button
                            onClick={() => {
                                setOpen(false);
                                signOut({ callbackUrl: "/" });
                            }}
                            className="
                flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left
                hover:bg-destructive/10 focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background
              "
                        >
                            <span className="grid size-9 place-items-center rounded-lg bg-card border border-border/60">
                                <LogOut className="h-4 w-4 text-destructive" />
                            </span>
                            <span className="text-base font-medium text-destructive">
                                Log out
                            </span>
                        </button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}

/* Main Navbar */
export function Navbar() {
    const router = useRouter();
    const { data: session, status } = useSession(); // Get session for desktop navbar

    // Search state
    const [searchOpen, setSearchOpen] = useState(false);
    const [q, setQ] = useState("");
    const searchRef = useRef<HTMLDivElement>(null);

    // Close search when clicking outside
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

    // Submit search
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

    // Nav items
    const navItems = [
        { name: "Movies", href: "/movies", icon: Film },
        { name: "TV Shows", href: "/tv", icon: Tv },
        { name: "Books", href: "/books", icon: BookText },
        { name: "Games", href: "/games", icon: Gamepad2 },
    ];

    return (
        <>
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
                        {/* Left: Hamburger + Brand + Desktop nav */}
                        <div className="flex items-center gap-2 md:gap-4 min-w-0">
                            <MobileNav navItems={navItems} />
                            <Link href="/" className="flex items-center">
                                <span className="text-lg font-semibold md:text-2xl md:font-bold md:tracking-wide md:uppercase">
                                    Trakmymedia
                                </span>
                            </Link>
                            <div className="hidden md:flex items-center gap-6 ml-4">
                                {navItems.map((i) => (
                                    <ActiveNavLink key={i.name} href={i.href}>
                                        {i.name}
                                    </ActiveNavLink>
                                ))}
                            </div>
                        </div>

                        {/* Right: Search + Profile/Auth buttons */}
                        <div className="flex items-center gap-1.5 md:gap-2">
                            {/* Desktop search */}
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

                            {/* Mobile search icon */}
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Open search"
                                onClick={() => setSearchOpen((v) => !v)}
                                className="h-9 w-9 md:hidden"
                            >
                                <Search className="h-5 w-5" />
                            </Button>

                            {/* Auth section - Different for desktop vs mobile */}
                            {status === "authenticated" && session?.user ? (
                                <>
                                    {/* DESKTOP: Avatar with dropdown menu */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="hidden md:flex relative h-9 w-9 rounded-full p-0"
                                                aria-label="User menu"
                                            >
                                                <Avatar className="h-9 w-9 ring-2 ring-transparent hover:ring-primary transition">
                                                    <AvatarImage
                                                        src={
                                                            session.user
                                                                .image ||
                                                            undefined
                                                        }
                                                        alt={
                                                            session.user.name ||
                                                            "User"
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {session.user.name
                                                            ?.charAt(0)
                                                            .toUpperCase() ||
                                                            session.user.email
                                                                ?.charAt(0)
                                                                .toUpperCase() ||
                                                            "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-56"
                                        >
                                            {/* User info header */}
                                            <div className="flex items-center gap-2 p-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={
                                                            session.user
                                                                .image ||
                                                            undefined
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {session.user.name
                                                            ?.charAt(0)
                                                            .toUpperCase() ||
                                                            session.user.email
                                                                ?.charAt(0)
                                                                .toUpperCase() ||
                                                            "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col space-y-0.5">
                                                    <p className="text-sm font-medium">
                                                        {session.user.name ||
                                                            "User"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {session.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <DropdownMenuSeparator />
                                            {/* View profile option */}
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href="/profile"
                                                    className="cursor-pointer"
                                                >
                                                    <User className="mr-2 h-4 w-4" />
                                                    View your profile
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            {/* Logout option */}
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    signOut({
                                                        callbackUrl: "/",
                                                    })
                                                }
                                                className="cursor-pointer text-destructive focus:text-destructive"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Log out
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* MOBILE: Direct link to profile (no dropdown) */}
                                    <Link
                                        href="/profile"
                                        aria-label="Your profile"
                                        className="md:hidden"
                                    >
                                        <Avatar className="h-9 w-9 ring-2 ring-transparent active:ring-primary transition">
                                            <AvatarImage
                                                src={
                                                    session.user.image ||
                                                    undefined
                                                }
                                                alt={
                                                    session.user.name || "User"
                                                }
                                            />
                                            <AvatarFallback>
                                                {session.user.name
                                                    ?.charAt(0)
                                                    .toUpperCase() ||
                                                    session.user.email
                                                        ?.charAt(0)
                                                        .toUpperCase() ||
                                                    "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                </>
                            ) : (
                                // Not authenticated: Show signup + login buttons
                                <>
                                    {/* DESKTOP: Both buttons visible */}
                                    <div className="hidden md:flex items-center gap-2">
                                        <Link href="/signup">
                                            <Button variant="default" size="sm">
                                                Sign up
                                            </Button>
                                        </Link>
                                        <Link href="/login">
                                            <Button variant="outline" size="sm">
                                                Log in
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* MOBILE: Avatar with "?" that links to login */}
                                    <Link
                                        href="/login"
                                        className="md:hidden"
                                        aria-label="Log in"
                                    >
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback>?</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile search row */}
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
