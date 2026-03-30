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

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user: userData } = await authApi.checkAuth();
        setUser(userData ?? null);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isAuthRoute = pathname?.startsWith("/auth");
    const isPublicRoute =
      pathname === "/" ||
      pathname?.startsWith("/about") ||
      pathname?.startsWith("/product") ||
      pathname?.startsWith("/how-it-works");

    const isAuth = !!user;

    if (!isAuth && !isAuthRoute && !isPublicRoute) {
      router.push("/auth/login");
    } else if (isAuth && isAuthRoute) {
      router.push("/onboard");
    }
  }, [isLoading, user, pathname, router]);

  const login = () => {
    authApi.loginWithGitHub();
  };

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      setUser(null);
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
