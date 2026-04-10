
export const appConfig = {
  name: "XecureCode",
  tagline: "AI-powered reliability for production systems",
  description:
    "XecureCode introduces a decision layer between observability and action, making failures understandable, predictable, and recoverable.",
  version: "1.0.0",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://xecurecode.com",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  supportEmail: "hello@xecurecode.com",
  features: {
    waitlist: true,
    contact: true,
    blog: false,
    dashboard: false,
    docs: false,
  },
} as const;

export type AppConfig = typeof appConfig;
