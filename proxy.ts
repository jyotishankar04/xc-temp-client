import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/verify-email",
  "/admin/login",
];
const PROTECTED_ROUTE_PREFIXES = ["/app", "/onboard", "/admin"];
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getSetCookieHeaders(response: Response) {
  const headersWithGetSetCookie = response.headers as Headers & {
    getSetCookie?: () => string[];
  };

  const setCookieHeaders = headersWithGetSetCookie.getSetCookie?.();
  if (setCookieHeaders?.length) {
    return setCookieHeaders;
  }

  const setCookie = response.headers.get("set-cookie");
  return setCookie ? [setCookie] : [];
}

function forwardSetCookieHeaders(source: Response, target: NextResponse) {
  for (const cookie of getSetCookieHeaders(source)) {
    target.headers.append("set-cookie", cookie);
  }

  return target;
}

function getCookiePairsFromSetCookie(response: Response) {
  return getSetCookieHeaders(response)
    .map((cookie) => cookie.split(";")[0]?.trim())
    .filter((cookie): cookie is string => Boolean(cookie));
}

async function fetchAuthCheck(path: string, cookie: string) {
  return fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      Cookie: cookie,
    },
    credentials: "include",
  });
}

async function refreshSession(isAdminRoute: boolean, cookie: string) {
  return fetch(`${API_URL}${isAdminRoute ? "/api/v1/auth/admin/refresh" : "/api/v1/auth/refresh"}`, {
    method: "POST",
    headers: {
      Cookie: cookie,
    },
    credentials: "include",
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedRoute =
    !isAuthRoute &&
    PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  try {
    const authCheckPath = isAdminRoute ? "/api/v1/admin/me" : "/api/v1/users/me";
    const cookie = request.headers.get("cookie") || "";
    let response = await fetchAuthCheck(authCheckPath, cookie);
    let refreshResponse: Response | null = null;

    if (!response.ok) {
      refreshResponse = await refreshSession(isAdminRoute, cookie);
      if (refreshResponse.ok) {
        const refreshedCookie = getCookiePairsFromSetCookie(refreshResponse).join("; ");
        response = await fetchAuthCheck(
          authCheckPath,
          refreshedCookie ? `${cookie}; ${refreshedCookie}` : cookie,
        );
      }
    }

    if (!response.ok) {
      if (isProtectedRoute) {
        const loginUrl = new URL(isAdminRoute ? "/admin/login" : "/auth/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    }

    const data = await response.json();

    if (isAuthRoute && data.success) {
      const dashboardUrl = new URL(
        isAdminRoute ? "/admin" : "/app/dashboard",
        request.url,
      );
      const redirect = NextResponse.redirect(dashboardUrl);
      return refreshResponse ? forwardSetCookieHeaders(refreshResponse, redirect) : redirect;
    }

    if (data.requirement === "/onboard" && !pathname.startsWith("/onboard")) {
      const onboardUrl = new URL("/onboard", request.url);
      const redirect = NextResponse.redirect(onboardUrl);
      return refreshResponse ? forwardSetCookieHeaders(refreshResponse, redirect) : redirect;
    }

    if (pathname.startsWith("/onboard") && data.requirement !== "/onboard") {
      const dashboardUrl = new URL("/app/dashboard", request.url);
      const redirect = NextResponse.redirect(dashboardUrl);
      return refreshResponse ? forwardSetCookieHeaders(refreshResponse, redirect) : redirect;
    }

    const next = NextResponse.next();
    return refreshResponse ? forwardSetCookieHeaders(refreshResponse, next) : next;
  } catch (error) {
    console.error("Middleware auth check failed:", error);
    if (isProtectedRoute) {
      const loginUrl = new URL(isAdminRoute ? "/admin/login" : "/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
