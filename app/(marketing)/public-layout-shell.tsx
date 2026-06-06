"use client";

import { usePathname } from "next/navigation";

import { Footer, Navbar } from "@/components/shared/layout";

export function PublicLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDocsRoute = pathname === "/docs" || pathname.startsWith("/docs/");

  if (isDocsRoute) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
