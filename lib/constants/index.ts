export * from "./routes";

export const TEAM_SIZES = [
  { label: "1–5 engineers", value: "1-5" },
  { label: "6–20 engineers", value: "6-20" },
  { label: "21–50 engineers", value: "21-50" },
  { label: "50+ engineers", value: "50+" },
] as const;

export const USE_CASES = [
  { label: "Backend", value: "Backend" },
  { label: "Frontend", value: "Frontend" },
  { label: "Cloud Infrastructure", value: "CloudInfrastructure" },
  { label: "Other", value: "Other" },
] as const;

export const NAV_LINKS = [
  { label: "Product", href: "/product" },
  { label: "How it Works", href: "/how-it-works" },
  { label: "Solutions", href: "/solutions" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/xecurecode", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/xecurecode",
    icon: "linkedin",
  },
  { label: "Twitter", href: "https://twitter.com/xecurecode", icon: "twitter" },
] as const;
