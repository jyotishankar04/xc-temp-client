// navbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/shared/branding/logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "../../marketing/landing/navigation-sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Simple fade in after mount
    setIsVisible(true);
    setWindowWidth(window.innerWidth);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Calculate squeeze percentage based on screen width
  const getSqueezeWidth = () => {
    if (!scrolled) return "95%";

    // Less squeeze on smaller screens
    if (windowWidth < 640) { // mobile
      return "92%";
    } else if (windowWidth < 768) { // small tablets
      return "90%";
    } else if (windowWidth < 1024) { // tablets
      return "85%";
    } else { // desktop
      return "80%";
    }
  };

  return (
    <motion.div
      className="fixed top-0 z-50 w-full flex justify-center px-2 sm:px-4 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -20
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.header
        animate={{
          width: getSqueezeWidth(),
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
        className={`mx-auto transition-all duration-200 w-full ${scrolled
          ? "border border-border/40 bg-background/80 backdrop-blur-xl shadow-lg rounded-full"
          : "border border-border/10 bg-background/40 backdrop-blur-md shadow-sm rounded-2xl"
          }`}
        style={{
          maxWidth: scrolled
            ? windowWidth < 640
              ? "min(600px, 98%)" // smaller max width on mobile
              : windowWidth < 1024
                ? "min(850px, 95%)" // medium max width on tablet
                : "min(950px, 95%)" // normal max width on desktop
            : "min(1280px, 98%)",
        }}
      >
        <div className="mx-auto flex h-16 items-center justify-between px-3 sm:px-4 md:px-6">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-10 w-10 rounded-full" />
              <span className="text-xl font-bold">XecureCode</span>
            </Link>

            {/* Desktop Menu - Hidden on mobile/tablet */}
            <NavMenu className="hidden lg:block" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Link href="/waitlist">
              <Button
                size="sm"
                className="rounded-full hidden lg:block bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 text-xs sm:text-sm px-3 sm:px-4"
              >
                Join Waitlist
              </Button>
            </Link>

            {/* Mobile Menu - Visible on medium screens and below */}
            <div className="lg:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </motion.header>
    </motion.div>
  );
};

export default Navbar;
