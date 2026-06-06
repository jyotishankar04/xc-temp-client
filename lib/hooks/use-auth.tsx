"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { authApi, type User } from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";

const PROTECTED_ROUTE_PREFIXES = [ROUTES.DASHBOARD, ROUTES.ORGS, ROUTES.ONBOARD];

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
  const queryClient = useQueryClient();
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

    const isOnboardingRoute = pathname === ROUTES.ONBOARD;
    const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some((route) => pathname === route || pathname?.startsWith(route));

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
      queryClient.clear();
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
      router.push("/app/dashboard");
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
