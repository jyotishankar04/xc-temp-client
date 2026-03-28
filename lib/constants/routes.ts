export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  PRODUCT: "/product",
  HOW_IT_WORKS: "/how-it-works",
  BLOG: "/blog",
  SOLUTIONS: "/solutions",
  CONTACT: "/contact",
  WAITLIST: "/waitlist",

  DASHBOARD: "/app/dashboard",
  DASHBOARD_OVERVIEW: "/app/dashboard",
  DASHBOARD_FAILURES: "/app/dashboard/failures",
  DASHBOARD_FAILURE_DETAIL: "/app/dashboard/failures",
  DASHBOARD_ANALYSIS: "/app/dashboard/analysis",
  DASHBOARD_ACTIONS: "/app/dashboard/actions",
  DASHBOARD_SERVICES: "/app/dashboard/services",
  DASHBOARD_SETUP: "/app/dashboard/setup",
  DASHBOARD_TEAM: "/app/dashboard/team",
  DASHBOARD_AUDIT: "/app/dashboard/audit",
  DASHBOARD_SETTINGS: "/app/dashboard/settings",

  AUTH_LOGIN: "/auth/login",
  AUTH_SIGNUP: "/auth/signup",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH_VERIFY_EMAIL: "/auth/verify-email",

  ONBOARD: "/onboard",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
