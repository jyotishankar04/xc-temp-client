// nav-menu.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const navItems = [
  { href: "/product", label: "Product" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "/solutions", label: "Solutions" },
  { href: "/blogs", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => {
  const pathname = usePathname();

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="space-x-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink asChild active={isActive}>
                <Link
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-4 -bottom-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};