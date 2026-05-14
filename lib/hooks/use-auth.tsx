"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { authApi, type User } from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";

const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.PRODUCT,
  ROUTES.HOW_IT_WORKS,
  ROUTES.BLOG,
  ROUTES.SOLUTIONS,
  ROUTES.CONTACT,
  ROUTES.WAITLIST,
];

const AUTH_ROUTES = [ROUTES.AUTH_LOGIN, ROUTES.AUTH_SIGNUP, ROUTES.AUTH_FORGOT_PASSWORD, ROUTES.AUTH_VERIFY_EMAIL];

const PROTECTED_ROUTES = Object.values(ROUTES).filter(
  (route) => route.startsWith("/dashboard") || route.startsWith("/onboard")
);

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  requiresOnboarding: boolean;
  login: () => void;
  logout: () => Promise<void>;
  onboard: (data: {
    orgName: string;
    orgSlug: string;
    teamSize?: string;
    role: string;
    notes?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requiresOnboarding, setRequiresOnboarding] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authApi.checkAuth();
        
        if (res.requirement === "/onboard") {
          setUser(res.user ?? null);
          setRequiresOnboarding(true);
        } else {
          setUser(res.user ?? null);
          setRequiresOnboarding(false);
        }
      } catch {
        setUser(null);
        setRequiresOnboarding(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname?.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname?.startsWith(route));
    const isOnboardingRoute = pathname === ROUTES.ONBOARD;
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname === route || pathname?.startsWith(route));

    const isAuth = !!user;

    if (!isAuth && isProtectedRoute && !isOnboardingRoute) {
      router.push(ROUTES.AUTH_LOGIN);
      return;
    }

    if (isAuth && requiresOnboarding && isProtectedRoute && !isOnboardingRoute) {
      router.replace(ROUTES.ONBOARD);
      return;
    }

    if (isAuth && isOnboardingRoute && !requiresOnboarding) {
      router.replace(ROUTES.DASHBOARD);
      return;
    }
  }, [isLoading, user, requiresOnboarding, pathname, router]);

  const login = () => {
    authApi.loginWithGitHub();
  };

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      setUser(null);
      setRequiresOnboarding(false);
      router.push("/auth/login");
    },
  });

  const onboardMutation = useMutation({
    mutationFn: (data: {
      orgName: string;
      orgSlug: string;
      teamSize?: string;
      role: string;
      notes?: string;
    }) => authApi.onboard(data),
    onSuccess: (data) => {
      setUser(data.user);
      setRequiresOnboarding(false);
      router.push("/dashboard");
    },
  });

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const onboard = async (data: {
    orgName: string;
    orgSlug: string;
    teamSize?: string;
    role: string;
    notes?: string;
  }) => {
    await onboardMutation.mutateAsync(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        requiresOnboarding,
        login,
        logout,
        onboard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
