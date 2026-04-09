// navigation-sheet.tsx
"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Logo } from "@/components/shared/branding/logo";
import { NavMenu } from "../../shared/layout/nav-menu";
import Link from "next/link";

interface NavigationSheetProps {
  isAuthenticated?: boolean;
  isLoading?: boolean;
}

export const NavigationSheet = ({ isAuthenticated = false, isLoading = false }: NavigationSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "var(--scrollbar-compensation, 0px)";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen]);

  // Calculate scrollbar width to prevent layout shift
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-compensation', `${scrollbarWidth}px`);
  }, []);

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full relative z-50 transition-colors duration-200"
        size="icon"
        variant={isOpen ? "default" : "outline"}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with blur effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown menu from top */}
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1], // Custom easing for smooth motion
              }}
              className="fixed left-0 right-0 top-[88px] z-50 mx-auto w-[calc(100%-2rem)] sm:w-[95%] max-w-2xl"
              style={{
                filter: "drop-shadow(0 20px 30px -10px rgba(0, 0, 0, 0.2))",
              }}
            >
              <div className="bg-background/95 backdrop-blur-md border border-border/40 rounded-2xl shadow-2xl overflow-hidden">
                {/* Decorative gradient line at top */}
                <div className="h-1 w-full bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

                <div className="p-6">
                  {/* Logo and Brand with hover effect */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                    className="flex items-center gap-3 pb-4 border-b border-border/40"
                  >
                    <Logo className="h-10 w-10 rounded-full transition-transform hover:scale-105" />
                    <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      xecureCode
                    </span>
                  </motion.div>

                  {/* Navigation Menu with staggered children animation */}
                  <div className="py-4">
                    <NavMenu
                      orientation="vertical"
                      className="[&>div]:w-full [&>div>ul]:flex-col [&>div>ul]:items-stretch [&>div>ul]:space-x-0 [&>div>ul]:space-y-1"
                    />
                  </div>

                  {/* Get Estimate Button with animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="pt-4 border-t border-border/40"
                  >
                    {isLoading ? (
                      <Button
                        className="w-full rounded-full bg-primary text-primary-foreground shadow-md"
                        disabled
                      >
                        Loading...
                      </Button>
                    ) : isAuthenticated ? (
                      <Link href="/app/dashboard" onClick={() => setIsOpen(false)}>
                        <Button
                          className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md shadow-md group"
                        >
                          <span className="relative">
                            Go to Dashboard
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/50 group-hover:w-full transition-all duration-300" />
                          </span>
                        </Button>
                      </Link>
                    ) : (
                      <div className="flex gap-2">
                        <Link href="/auth/login" onClick={() => setIsOpen(false)} className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full rounded-full"
                          >
                            Login
                          </Button>
                        </Link>
                        <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="flex-1">
                          <Button
                            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md shadow-md group"
                          >
                            <span className="relative">
                              Sign Up
                              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/50 group-hover:w-full transition-all duration-300" />
                            </span>
                          </Button>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};