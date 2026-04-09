# XecureCode Frontend - Agent Guidelines

## Project Overview

Next.js 16 frontend application for XecureCode - an AI-powered reliability platform for production systems. Built with TypeScript, Tailwind CSS, shadcn/ui, and React 19.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | motion (framer-motion successor) |
| Forms | react-hook-form + @hookform/resolvers |
| Validation | Zod v4 |
| Database | PostgreSQL via Prisma |
| Package Manager | pnpm |

## Directory Structure

```
xc-frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth pages (login, signup, etc.)
│   ├── (dashboard)/             # Dashboard pages (protected, future)
│   ├── (marketing)/             # Marketing pages (public)
│   ├── api/                     # API routes (temporary - backend is separate)
│   ├── layout.tsx               # Root layout
│   └── page.tsx                # Landing page
│
├── components/
│   ├── ui/                      # shadcn/ui primitives
│   ├── shared/                  # Shared across all domains
│   │   ├── layout/             # Navbar, Footer
│   │   └── branding/           # Logo, ThemeToggle
│   ├── marketing/               # Marketing domain
│   │   ├── landing/            # Landing page sections
│   │   ├── product/            # Product page sections
│   │   ├── how-it-works/       # How-it-works sections
│   │   └── coming-soon.tsx     # Placeholder component
│   └── kibo-ui/                # Third-party UI registry
│
├── lib/                         # Shared libraries
│   ├── api/                    # API client for external backend
│   │   ├── client.ts          # Base fetch wrapper with error handling
│   │   └── auth.ts            # Auth API functions
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # Shared TypeScript types
│   ├── utils/                  # Utilities (cn, format, validators)
│   ├── config/                 # App configuration
│   └── constants/             # App constants (routes, nav links, etc.)
│
├── prisma/                      # Database schema (temporary)
└── public/                     # Static assets
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Page components | `PascalCase` + `Page` suffix | `LoginPage`, `DashboardOverviewPage` |
| Section components | `PascalCase` | `HeroSection`, `CTASection` |
| UI primitives | `PascalCase` (shadcn) | `Button`, `Input` |
| Shared layout | `kebab-case` | `navbar.tsx`, `footer.tsx` |
| Hooks | `camelCase` + `use` prefix | `useAuth`, `useDebounce` |
| API modules | `camelCase` + `Api` suffix | `authApi`, `incidentsApi` |
| Types/Interfaces | `PascalCase` | `User`, `Incident`, `ApiError` |
| Constants | `UPPER_SNAKE_CASE` | `ROUTES`, `API_ENDPOINTS` |

## Component Patterns

### Page Components
```typescript
export default function ProductPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <ProductHero />
      <Features />
      <CTASection />
    </main>
  );
}
```

### Section Components
```typescript
export function HeroSection() {
  return (
    <section className="py-24">
      {/* section content */}
    </section>
  );
}
```

### Shared Layout Components
```typescript
// components/shared/layout/navbar.tsx
export function Navbar() {
  return <header>...</header>;
}

// components/shared/layout/index.ts
export { Navbar } from "./navbar";
export { Footer } from "./footer";
```

## Route Groups

| Group | Purpose | Layout |
|-------|---------|--------|
| `(auth)` | Login, signup, password reset | Centered minimal layout |
| `(dashboard)` | Protected app pages | Sidebar + header layout |
| `(marketing)` | Public marketing pages | Navbar + Footer |

## Important Paths

| Purpose | Path |
|---------|------|
| Shared components | `components/shared/` |
| Marketing components | `components/marketing/` |
| UI primitives | `components/ui/` |
| API client | `lib/api/client.ts` |
| Constants | `lib/constants/` |
| Routes definition | `lib/constants/routes.ts` |

## Common Tasks

### Adding a new marketing page
1. Create page in `app/(marketing)/new-page/page.tsx`
2. Create section components in `components/marketing/new-page/`
3. Use shared layout: `import { Navbar, Footer } from "@/components/shared/layout"`

### Adding a new API endpoint
1. Add endpoint function in `lib/api/modules/` (for external backend)
2. Create hook in `lib/hooks/` for React usage

### Adding a new shared component
1. Create in appropriate `components/shared/` subdirectory
2. Export from `components/shared/[subdir]/index.ts`

## Build Commands

```bash
pnpm dev      # Development server
pnpm build    # Production build
pnpm lint     # ESLint
pnpm tsc     # TypeScript check
```

## Notes

- Backend is a separate repository - API routes in `app/api/` are temporary
- Dashboard features are not yet implemented (placeholders exist)
- All pages should export as named exports where possible
- Use `cn()` from `lib/utils` for className merging
- Zod schemas should be in `lib/utils/validators.ts` for sharing
