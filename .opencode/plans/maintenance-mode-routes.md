# Maintenance Mode - Route Scoping & Text Update

## Changes

### 1. `components/shared/maintenance-guard.tsx`
Invert logic from "exempt some, block all" to "block only protected routes":
- Remove: `EXEMPT_PREFIXES = ["/admin", "/docs"]`
- Add: `BLOCKED_PREFIXES = ["/auth", "/app", "/onboard", "/launch"]`
- Rename `isExempt` to `isBlocked` and invert the return logic

### 2. `components/marketing/landing/maintenance-page.tsx`
Change default subtitle from `"We're making a few updates and will be back shortly."` to `"Something's cooking..."`

## Effect

| Routes | During Maintenance |
|--------|-------------------|
| `/`, `/product`, `/how-it-works`, etc. (marketing) | Show normally |
| `/docs/*` | Show normally |
| `/admin/*` | Show normally (admin can toggle) |
| `/auth/*` (login, signup) | Show maintenance screen |
| `/app/*` (dashboard, orgs) | Show maintenance screen |
| `/onboard`, `/launch` | Show maintenance screen |
