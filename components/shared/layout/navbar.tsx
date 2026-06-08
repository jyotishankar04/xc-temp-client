"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Clock3,
  HelpCircle,
  Home,
  Menu,
  Newspaper,
  Shield,
  X,
} from "lucide-react";

import { Logo } from "@/components/shared/branding/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";

type DropdownItem = {
  icon: typeof BookOpen;
  label: string;
  description: string;
  href: string;
};

type NavItem =
  | { label: string; href: string; dropdown?: undefined }
  | { label: string; href: string; dropdown: DropdownItem[]; columns: 1 | 2 };

const NAV_ITEMS: NavItem[] = [
  {
    label: "Product",
    href: "/product",
    columns: 2,
    dropdown: [
      {
        icon: Cloud,
        label: "Platform",
        description: "Capture failures, cases, RCA, and rollback in one flow.",
        href: "/product",
      },
      {
        icon: Shield,
        label: "Reliability",
        description: "Audit-ready workflows with review and approval steps.",
        href: "/solutions",
      },
      {
        icon: Home,
        label: "Dashboard",
        description: "Operate incidents and recovery actions from one place.",
        href: "/docs/dashboard",
      },
      {
        icon: Building2,
        label: "Organizations",
        description: "Manage services, members, and access controls.",
        href: "/docs/concepts",
      },
    ],
  },
  {
    label: "How It Works",
    href: "/how-it-works",
    columns: 2,
    dropdown: [
      {
        icon: BookOpen,
        label: "Concepts",
        description: "Understand organizations, services, and failure events.",
        href: "/docs/concepts",
      },
      {
        icon: CheckCircle2,
        label: "Getting Started",
        description: "Send your first failure event and inspect the result.",
        href: "/docs/getting-started",
      },
      {
        icon: HelpCircle,
        label: "Troubleshooting",
        description: "Debug SDK setup, auth, ingestion, and rollback issues.",
        href: "/docs/troubleshooting",
      },
      {
        icon: Clock3,
        label: "Recovery Flow",
        description: "Review how cases, RCA, and actions move asynchronously.",
        href: "/docs/dashboard",
      },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    columns: 1,
    dropdown: [
      {
        icon: Home,
        label: "Startup teams",
        description: "Ship faster with fewer incident handling gaps.",
        href: "/solutions",
      },
      {
        icon: Building2,
        label: "Platform teams",
        description: "Standardize recovery workflows across services.",
        href: "/docs/concepts",
      },
      {
        icon: Shield,
        label: "Compliance-minded orgs",
        description: "Keep a durable audit trail for critical actions.",
        href: "/docs/dashboard",
      },
    ],
  },
  {
    label: "Blog",
    href: "/blogs",
  },
  {
    label: "Docs",
    href: "/docs",
  },
];

function DropdownPanel({ items, columns }: { items: DropdownItem[]; columns: 1 | 2 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "absolute left-1/2 top-full mt-3 -translate-x-1/2 overflow-hidden rounded-2xl border bg-background/98 shadow-2xl backdrop-blur-xl",
        columns === 2 ? "min-w-[520px]" : "min-w-[320px]",
      )}
    >
      <div className="h-px w-full bg-linear-to-r from-transparent via-primary/50 to-transparent" />
      <div className={cn("p-2", columns === 2 && "grid grid-cols-2 gap-0.5")}>
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted/70"
          >
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border bg-muted/50 text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary">
              <item.icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium leading-none text-foreground">{item.label}</p>
              <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const firstMobileItemRef = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.position = "absolute";
    sentinel.style.top = "0";
    sentinel.style.height = "50px";
    sentinel.style.width = "1px";
    sentinel.style.pointerEvents = "none";
    sentinel.style.visibility = "hidden";
    document.body.prepend(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMenu(null);
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      firstMobileItemRef.current?.focus();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    toggleRef.current?.focus();
    document.body.style.overflow = "";
    return undefined;
  }, [menuOpen]);

  const openMenu = (label: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveMenu(label);
  };

  const scheduleClose = () => {
    closeTimerRef.current = setTimeout(() => setActiveMenu(null), 140);
  };

  const cancelClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  };

  return (
    <header>
      <AnimatePresence mode="wait">
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10"
            role="button"
            tabIndex={0}
            aria-label="Close dropdown menu"
            onClick={() => setActiveMenu(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveMenu(null);
              }
            }}
          />
        )}
      </AnimatePresence>

      <nav role="navigation" aria-label="Main navigation" className="fixed top-0 z-20 w-full px-2 pt-2">
        <motion.div
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className={cn(
            "mx-auto max-w-6xl px-4 transition-[max-width,border-radius] duration-200 lg:px-6",
            isScrolled || activeMenu ? "max-w-5xl" : "",
          )}
        >
          <div
            className={cn(
              "relative flex items-center justify-between gap-6 border bg-background/70 px-4 py-3 backdrop-blur-xl",
              isScrolled || activeMenu ? "rounded-2xl shadow-xl" : "rounded-[1.4rem] shadow-md",
            )}
          >
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-10 w-10" />
              <span className="text-lg font-semibold tracking-tight">XecureCode</span>
            </Link>

            <div className="absolute inset-0 mx-auto hidden w-fit items-center lg:flex">
              <ul className="flex items-center gap-1 text-sm">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label} className="relative">
                    {item.dropdown ? (
                      <div onMouseEnter={() => openMenu(item.label)} onMouseLeave={scheduleClose}>
                        <button
                          type="button"
                          className={cn(
                            "flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors",
                            activeMenu === item.label
                              ? "bg-muted/70 text-foreground"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                          )}
                        >
                          {item.label}
                          <ChevronDown
                            className={cn("size-4 transition-transform duration-200", activeMenu === item.label && "rotate-180")}
                          />
                        </button>

                        <AnimatePresence mode="wait" initial={false}>
                          {activeMenu === item.label && (
                            <div onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
                              <DropdownPanel items={item.dropdown} columns={item.columns} />
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        aria-current={pathname === item.href ? "page" : undefined}
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm transition-colors",
                          pathname === item.href
                            ? "bg-muted/60 text-foreground"
                            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <div className="hidden items-center gap-2 lg:flex">
                {isLoading ? (
                  <Button disabled size="sm" className="rounded-full">
                    Loading...
                  </Button>
                ) : isAuthenticated ? (
                  <Button asChild size="sm" className="rounded-full">
                    <Link href="/app/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="ghost" size="sm" className="rounded-full">
                      <Link href="/auth/login">Login</Link>
                    </Button>
                    <Button asChild size="sm" className="rounded-full">
                      <Link href="/auth/signup">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>

              <button
                ref={toggleRef}
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="relative z-20 rounded-lg p-2 lg:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <X className="size-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Menu className="size-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {menuOpen && (
              <div className="overflow-hidden lg:hidden">
                <motion.div
                  id="mobile-menu"
                  initial={{ opacity: 0, y: -16, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } }}
                  exit={{ opacity: 0, y: -16, transition: { duration: 0.12, ease: [0.25, 0.1, 0.25, 1] } }}
                >
                  <div className="mt-2 rounded-2xl border bg-background/95 p-4 shadow-xl backdrop-blur-xl">
                  <ul className="space-y-1">
                    {NAV_ITEMS.map((item, index) => (
                      <li key={item.label}>
                        <Link
                          ref={index === 0 ? firstMobileItemRef : undefined}
                          href={item.href}
                          aria-current={pathname === item.href ? "page" : undefined}
                          className="block rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.label}
                        </Link>

                        {item.dropdown && (
                          <ul className="ml-2 mt-1 space-y-1 border-l pl-3">
                            {item.dropdown.map((sub) => (
                              <li key={sub.label}>
                                <Link
                                  href={sub.href}
                                  className="block rounded-lg px-3 py-2 text-xs text-muted-foreground/90 transition-colors hover:bg-muted hover:text-foreground"
                                  onClick={() => setMenuOpen(false)}
                                >
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 grid gap-2 border-t pt-4">
                    {isLoading ? (
                      <Button className="w-full rounded-full" disabled>
                        Loading...
                      </Button>
                    ) : isAuthenticated ? (
                      <Button asChild className="w-full rounded-full">
                        <Link href="/app/dashboard" onClick={() => setMenuOpen(false)}>
                          Go to Dashboard
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button asChild variant="outline" className="w-full rounded-full">
                          <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                            Login
                          </Link>
                        </Button>
                        <Button asChild className="w-full rounded-full">
                          <Link href="/auth/signup" onClick={() => setMenuOpen(false)}>
                            Get Started
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </nav>
    </header>
  );
}
