export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  PRODUCT: "/product",
  HOW_IT_WORKS: "/how-it-works",
  BLOG: "/blog",
  SOLUTIONS: "/solutions",
  CONTACT: "/contact",
  WAITLIST: "/waitlist",

  DASHBOARD: "/dashboard",
  DASHBOARD_OVERVIEW: "/dashboard/overview",
  DASHBOARD_INCIDENTS: "/dashboard/incidents",
  DASHBOARD_ANALYTICS: "/dashboard/analytics",
  DASHBOARD_SETTINGS: "/dashboard/settings",
  DASHBOARD_TEAM: "/dashboard/team",

  AUTH_LOGIN: "/auth/login",
  AUTH_SIGNUP: "/auth/signup",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH_VERIFY_EMAIL: "/auth/verify-email",

  ONBOARD: "/onboard",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
