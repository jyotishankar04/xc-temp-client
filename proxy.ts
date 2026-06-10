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
    const response = await fetch(`${API_URL}${authCheckPath}`, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });

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
      return NextResponse.redirect(dashboardUrl);
    }

    if (data.requirement === "/onboard" && !pathname.startsWith("/onboard")) {
      const onboardUrl = new URL("/onboard", request.url);
      return NextResponse.redirect(onboardUrl);
    }

    if (pathname.startsWith("/onboard") && data.requirement !== "/onboard") {
      const dashboardUrl = new URL("/app/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
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
