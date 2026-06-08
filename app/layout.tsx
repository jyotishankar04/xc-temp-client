import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryProvider } from "@/lib/providers/query-provider";
import { AuthProvider } from "@/lib/hooks/use-auth";
import { MaintenanceGuard } from "@/components/shared/maintenance-guard";
import { LaunchGuard } from "@/components/shared/launch-guard";
import { getPublicPlatformState } from "@/lib/api/platform";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XecureCode",
  description: "AI-powered reliability for production systems",
  icons: {
    icon: "/favicon.ico",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const platform = await getPublicPlatformState();

  return (
    <html lang="en" className={cn("font-sans", inter.variable)} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:no-underline"
        >
          Skip to main content
        </a>
        <RootProvider theme={{ enabled: false }}>
          <QueryProvider>
            <AuthProvider>
              <ThemeProvider defaultTheme="dark" attribute="class">
                <TooltipProvider delayDuration={0}>
                  <main id="main-content" tabIndex={-1}>
                  {platform.settings.maintenanceMode ? (
                    <MaintenanceGuard maintenanceMessage={platform.settings.maintenanceMessage}>
                      {children}
                    </MaintenanceGuard>
                  ) : platform.activeLaunch?.type === "MAJOR" && platform.activeLaunch.active ? (
                    <LaunchGuard
                      activeLaunch={platform.activeLaunch}
                      signupEnabled={platform.settings.signupEnabled}
                    >
                      {children}
                    </LaunchGuard>
                  ) : (
                    children
                  )}
                  </main>
                </TooltipProvider>
              </ThemeProvider>
            </AuthProvider>
          </QueryProvider>
        </RootProvider>
      </body>
    </html>
  );
}
