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

export const ONBOARDING_ROLES = [
  { label: "Founder", value: "founder" },
  { label: "Backend Engineer", value: "backend-engineer" },
  { label: "Frontend Engineer", value: "frontend-engineer" },
  { label: "DevOps / SRE", value: "devops-sre" },
  { label: "Engineering Manager", value: "engineering-manager" },
  { label: "Student / Exploring", value: "student" },
] as const;

export const ONBOARDING_STACKS = [
  { label: "Node.js", value: "nodejs" },
  { label: "Python", value: "python" },
  { label: "Go", value: "go" },
  { label: "Java", value: "java" },
  { label: "Docker", value: "docker" },
  { label: "Kubernetes", value: "kubernetes" },
  { label: "Other", value: "other" },
] as const;

export const ONBOARDING_ENVIRONMENTS = [
  { label: "AWS", value: "aws" },
  { label: "GCP", value: "gcp" },
  { label: "Azure", value: "azure" },
  { label: "Vercel", value: "vercel" },
  { label: "Self-hosted", value: "self-hosted" },
  { label: "Other", value: "other" },
] as const;

export const ONBOARDING_PAINS = [
  {
    label: "Finding root cause takes too long",
    value: "slow-root-cause",
  },
  { label: "Too many logs / alerts", value: "too-many-alerts" },
  { label: "Manual recovery is slow", value: "slow-recovery" },
  { label: "Frequent downtime", value: "frequent-downtime" },
  { label: "Just exploring", value: "exploring" },
] as const;

export const ONBOARDING_PRIORITIES = [
  { label: "Nice to have", value: "nice-to-have" },
  { label: "Important", value: "important" },
  { label: "Critical", value: "critical" },
] as const;

export const ONBOARDING_TEAM_SIZES = [
  { label: "1–5", value: "1-5" },
  { label: "5–10", value: "5-10" },
  { label: "10–50", value: "10-50" },
  { label: "50+", value: "50+" },
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
