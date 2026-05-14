# XecureCode - AI-Powered Production Reliability Platform

## Project Overview

XecureCode is an AI-powered SaaS platform that monitors production services and backends for errors, tracks them, identifies root causes, generates RCA reports, and provides intelligent recommendations including automatic rollback capabilities.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER'S SERVICE                                  │
│                                                                              │
│   ┌─────────────────┐         ┌──────────────────────────────────────────┐  │
│   │   XecureCode    │         │          Your Application               │  │
│   │       SDK       │────▶    │                                          │  │
│   │  (npm package)  │         │   npm install @xecurecode/sdk           │  │
│   └────────┬────────┘         │   configure(apiKey, serviceId)         │  │
│            │                   └──────────────────────────────────────────┘  │
└────────────┼────────────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          XECURECODE BACKEND                                  │
│                                                                              │
│   ┌──────────────────┐                                                      │
│   │  Ingest API      │◀────── Error + Context payload                       │
│   │  /api/v1/ingest  │         (message, stack, requestId,                 │
│   └────────┬─────────┘          serviceContext, timestamp)                 │
│            │                                                            │
│            ▼                                                            │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                        WORKERS (BullMQ + Redis)                      │  │
│   │                                                                       │  │
│   │  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐              │  │
│   │  │   Failure   │──▶│    Case     │──▶│     RCA     │              │  │
│   │  │   Worker    │   │   Worker    │   │   Worker    │              │  │
│   │  └─────────────┘   └──────┬──────┘   └──────┬──────┘              │  │
│   │                          │                  │                       │  │
│   │                          ▼                  ▼                       │  │
│   │                   ┌─────────────┐   ┌─────────────┐                │  │
│   │                   │  Severity   │   │   AI/LLM    │                │  │
│   │                   │ Calculation │   │   Analysis  │                │  │
│   │                   └─────────────┘   └──────┬──────┘                │  │
│   │                                              │                       │  │
│   │                                              ▼                       │  │
│   │                   ┌─────────────────────────────────────────┐       │  │
│   │                   │         TOOL CALLING SYSTEM             │       │  │
│   │                   │                                          │       │  │
│   │                   │  ┌──────────────┐  ┌────────────────┐   │       │  │
│   │                   │  │  notify()    │  │ auto_rollback()│   │       │  │
│   │                   │  └──────────────┘  └────────────────┘   │       │  │
│   │                   └─────────────────────────────────────────┘       │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                        AUTO-ROLLBACK SYSTEM                          │  │
│   │                                                                       │  │
│   │  1. Find previous stable commit (GitHub API)                        │  │
│   │  2. Create/update workflow file in user's repo                      │  │
│   │  3. Trigger workflow → redeployment (Vercel/Render/other)           │  │
│   │  4. Store rollback history                                           │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          XECURECODE FRONTEND                                 │
│                                                                              │
│   Dashboard Features:                                                        │
│   ┌─────────────┐  ┌─────────┐  ┌────────┐  ┌─────────┐  ┌──────────┐   │
│   │  Failures   │  │   RCA   │  │ Events │  │ Actions │  │ Rollback │   │
│   │   (list)    │  │ Reports │  │(trace) │  │ (notify)│  │  History │   │
│   └─────────────┘  └─────────┘  └────────┘  └─────────┘  └──────────┘   │
│                                                                              │
│   ┌─────────────┐  ┌─────────┐  ┌────────┐  ┌─────────┐  ┌──────────┐   │
│   │  Services   │  │   Team  │  │  Audit │  │Analysis │  │ Settings │   │
│   │ (manage)    │  │         │  │  Log   │  │         │  │          │   │
│   └─────────────┘  └─────────┘  └────────┘  └─────────┘  └──────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## User Authentication & Onboarding Flow

### 1. Authentication (GitHub OAuth)
```
User clicks "Login with GitHub"
         │
         ▼
GitHub OAuth Redirect
         │
         ▼
User authorizes XecureCode app
         │
         ▼
OAuth callback → Create/Update User in DB
         │
         ▼
Generate JWT (accessToken + refreshToken)
         │
         ▼
Set cookies (httpOnly) + redirect to dashboard
```

### 2. Onboarding Flow (for new users)
Onboarding is triggered when a user logs in for the first time and has no organization. It's a step-by-step wizard:

**Step 1: Create Organization**
- User provides: Organization name, slug (URL-friendly), team size, role
- Creates Organization + Owner membership

**Step 2: Create First Service** (like Vercel project creation)
- Service name (e.g., "my-api-service")
- Environment (PRODUCTION/DEVELOPMENT/STAGING)

**Step 3: Connect GitHub Repository**
- User selects GitHub repo (owner/repo format)
- Select branch to monitor
- Set environment

**Step 4: Configure Service Settings**
- Error criticality threshold (0-100)
- Auto-rollback enabled/disabled
- Auto-rollback threshold (0-100)

**Step 5: Get API Key**
- Create API key for the service
- SDK installation instructions

**Step 6: Invite Team Members**
- Invite by email with role (ADMIN/MEMBER/VIEWER)

**Onboarding Progress Tracking:**
```typescript
const steps = [
  { name: "service_created", label: "Create a service" },
  { name: "member_invited", label: "Invite team members" },
  { name: "api_key_created", label: "Create API key" },
  { name: "github_connected", label: "Connect GitHub" },
  { name: "events_ingested", label: "Ingest failure events" },
];
// Progress = (completedSteps / totalSteps) * 100
```

## Service Configuration (Vercel-like)

When creating a service, users configure:

### Basic Settings
| Field | Type | Description |
|-------|------|-------------|
| name | string | Service name (min 2, max 100 chars) |
| env | enum | PRODUCTION, DEVELOPMENT, STAGING |

### GitHub Integration
| Field | Type | Description |
|-------|------|-------------|
| repoFull | string | GitHub repo (owner/repo) |
| branch | string | Branch to monitor |
| environment | enum | PRODUCTION/DEVELOPMENT/STAGING |

### Auto-Rollback Configuration
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| autoRollbackEnabled | boolean | false | Enable automatic rollback |
| autoRollbackThreshold | number | 80 | Confidence score threshold (0-100) |

### Criticality Threshold
- User sets: `criticalityThreshold` per service
- Used to determine when to escalate/notify
- Range: 0-100

### Health Check
- User provides: `healthCheckUrl` - URL endpoint to check service health
- Used to verify service is running before rollback

## Database Schema Key Models

### User
```prisma
model User {
  id        String     @id @default(uuid())
  name      String
  username  String?    @unique
  email     String     @unique
  status    UserStatus @default(ACTIVE)
  avatarUrl String?
  memberships OrganizationMembership[]
  serviceMembers ServiceMember[]
  settings    UserSettings?
  onboarding  UserOnboarding?
}
```

### Organization
```prisma
model Organization {
  id     String    @id @default(uuid())
  name   String
  slug   String    @unique  // URL-friendly identifier
  plan   Plan      @default(FREE)
  status OrgStatus @default(ACTIVE)
  teamSize String?
  notes   String?
  services    Service[]
  memberships OrganizationMembership[]
  apiKeys     ApiKey[]
  github      GitHubIntegration?
}
```

### Service
```prisma
model Service {
  id                     String      @id @default(uuid())
  orgId                  String
  name                   String
  env                    Environment
  autoRollbackEnabled    Boolean     @default(false)
  autoRollbackThreshold   Int         @default(80)
  lastStableCommit        String?
  // Relations
  organization  Organization
  apiKeys       ApiKey[]
  failureCases  FailureCase[]
  failureEvents FailureEvent[]
  repoMapping   ServiceRepoMapping?
  members       ServiceMember[]
}
```

### ServiceRepoMapping
```prisma
model ServiceRepoMapping {
  id          String      @id @default(uuid())
  serviceId   String      @unique
  repoFull    String      // owner/repo
  branch      String
  environment Environment
  service     Service     @relation(fields: [serviceId], references: [id])
}
```

### GitHubIntegration
```prisma
model GitHubIntegration {
  id             String   @id @default(uuid())
  orgId          String   @unique
  githubOrg      String
  installationId String
  accessTokenEnc String   // Encrypted PAT
  scopes         String[]
  webhookSecret  String
  organization   Organization
}
```

## Error Ingest Pipeline (Connected Flow)

### 1. SDK → Ingest Endpoint
```
POST /api/v1/ingest
Headers: X-API-Key: <service_api_key>
Body: {
  message: "Error: connection refused",
  stack: "Error: connection refused at...",
  requestId: "req_123",
  serviceContext: { ... },
  timestamp: "2024-01-01T00:00:00Z"
}
```

### 2. Ingest Controller → Service
- Validates: `failurePayloadSchema` (Zod)
- Gets `serviceId` from API key (via `apiKeyGuard` middleware)

### 3. Ingest Service → Queue
```typescript
handleIngest = async (data, serviceId) => {
  // Generate unique requestId
  const requestId = uuid();
  
  // Generate fingerprint (SHA-256 hash)
  const fingerprint = generateFingerprint(message, stack, serviceId);
  
  // Dedupe (10 second window in Redis)
  const dedupeKey = `dedupe:${serviceId}:${fingerprint}`;
  if (!exists) {
    await failureQueue.add("failure_queue", {
      serviceId,
      fingerprint,
      payload: { ...data, requestId }
    });
    await redis.set(dedupeKey, "1", "EX", 10);
  }
}
```

### 4. Failure Worker (BullMQ)
- Creates `FailureEvent` in DB
- Queues to `failure_case_queue`

### 5. Case Worker
- Upserts `FailureCase` by fingerprint
- Calculates severity
- Queues RCA job
- Checks auto-rollback threshold

### 6. RCA Worker
- AI analysis with tool calling
- Generates RCA report
- Creates recommendations

### 7. Rollback Worker (if applicable)
- Finds stable commit
- Creates workflow
- Triggers deployment

## API Endpoints Summary

### Auth Routes (`/api/v1/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /github | GitHub OAuth redirect |
| GET | /callback | GitHub OAuth callback |
| POST | /logout | Logout user |

### Onboarding Routes (`/api/v1/onboarding`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | / | Create organization (onboard) |
| GET | /status | Get onboarding progress status |

### Organization Routes (`/api/v1/orgs`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all orgs for user |
| GET | /:id | Get single org |
| PATCH | /:id | Update org |

### Service Routes (`/api/v1/services`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | / | Create service |
| GET | / | Get all services |
| GET | /:serviceId | Get single service |
| PATCH | /:serviceId | Update service |
| DELETE | /:serviceId | Delete service |

### Service API Keys (`/api/v1/services/:serviceId/keys`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | / | Create API key |
| GET | / | Get all API keys |
| DELETE | /:keyId | Delete API key |

### Ingest Routes (`/api/v1/ingest`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | / | Ingest error (SDK endpoint, API key auth) |

### Events Routes (`/api/v1/events`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get events (with pagination) |
| GET | /:eventId | Get single event |
| GET | /:eventId/correlations | Get correlated events |

### Cases Routes (`/api/v1/cases`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get failure cases |
| GET | /:caseId | Get single case |

### RCA Routes (`/api/v1/rca`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get RCA reports |
| GET | /:caseId | Get RCA for case |
| POST | /analyze | Trigger RCA analysis |

### Rollback Routes (`/api/v1/rollback`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /history | Get rollback history |
| POST | /trigger | Manually trigger rollback |

### Dashboard Routes (`/api/v1/dashboard`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /stats | Get dashboard stats |

### Integrations Routes (`/api/v1/integrations`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /github | Get GitHub integration status |
| POST | /github | Connect GitHub |
| DELETE | /github | Disconnect GitHub |

### Service Members (`/api/v1/services/:serviceId/members`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get service members |
| POST | / | Invite member |
| DELETE | /:memberId | Remove member |

### Service Invitations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /accept | Accept invitation |
| POST | /reject | Reject invitation |

## Data Flow

### 1. Error Ingest Flow
```
User Service Error
        │
        ▼
SDK captures error + context
        │
        ▼
POST /api/v1/ingest (X-API-Key header)
        │
        ▼
apiKeyGuard validates service
        │
        ▼
IngestService.handleIngest
        │
        ├─▶ Generate requestId + fingerprint
        ├─▶ Dedupe check (Redis 10s window)
        └─▶ Queue to failure_queue
        │
        ▼
FailureWorker processes
        │
        ├─▶ Create FailureEvent in DB
        └─▶ Queue to failure_case_queue
```

### 2. Case Creation Flow
```
failure_case_queue
        │
        ▼
CaseWorker (upserts by fingerprint)
        │
        ├─▶ Increment occurrenceCount
        ├─▶ Calculate severity (LOW/MEDIUM/HIGH)
        ├─▶ Send notification (new case)
        ├─▶ Queue to rca_queue
        └─▶ Check auto-rollback threshold
              └─▶ Queue to rollback_queue
```

### 3. RCA Analysis Flow
```
rca_queue
        │
        ▼
RCAWorker (LangChain Agent)
        │
        ├─▶ Load case + events
        ├─▶ Analyze with LLM + tools
        ├─▶ Generate root cause + confidence
        └─▶ Tool calls: notify(), auto_rollback()
```

### 4. Auto-Rollback Flow
```
rollback_queue + confidence >= threshold
        │
        ▼
RollbackWorker
        │
        ├─▶ Get GitHub token from org
        ├─▶ Find last stable commit
        ├─▶ Create workflow file
        ├─▶ Trigger workflow
        ├─▶ Store rollback history
        └─▶ Send notification
              │
              ▼
        GitHub Actions runs
              │
              ▼
        Vercel/Render redeploys
```

## Core Features

### 1. Error Tracking (SDK)
- Install: `npm install @xecurecode/sdk`
- Configure: `xecurecode.configure({ apiKey, serviceId })`
- Auto-captures errors, stack traces, request context

### 2. Intelligent RCA Generation
- AI-powered root cause analysis
- Confidence scoring (0-100)
- Tool-based recommendations

### 3. Auto-Rollback System
- Triggered based on confidence threshold
- GitHub API for commit rollback
- Supports Vercel, Render, other platforms

### 4. Dashboard & Monitoring
- Real-time failure tracking
- Detailed RCA reports
- Rollback history
- Service management

## Severity Calculation

- **LOW**: < 5 occurrences in 2 minutes
- **MEDIUM**: 5-19 occurrences in 2 minutes
- **HIGH**: 20+ occurrences in 5 minutes

## Configuration

### Service Configuration
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| apiKey | string | auto | Unique per service |
| serviceId | string | UUID | Service identifier |
| autoRollbackEnabled | boolean | false | Enable auto-rollback |
| autoRollbackThreshold | number | 80 | Confidence threshold |
| repoMapping | object | null | GitHub repo info |

## Tech Stack

### Frontend
- Next.js 16 (App Router, React 19)
- TypeScript 5.x
- Tailwind CSS v4 + shadcn/ui
- pnpm

### Backend
- Node.js + Express.js
- TypeScript
- BullMQ + Redis
- Prisma + PostgreSQL
- LangChain (AI Agent)

### SDK
- JavaScript/TypeScript
- npm package

## Repository Structure

```
/run/media/sravesh/Alpha/projects/
├── xc-frontend/                    # Next.js Frontend
├── backends/back/                  # Express Backend
│   └── src/
│       ├── modules/v1/             # API routes
│       │   ├── auth/               # GitHub OAuth
│       │   ├── onboarding/         # Onboarding flow
│       │   ├── orgs/               # Organizations
│       │   ├── services/           # Service CRUD + keys
│       │   ├── ingest/             # SDK error endpoint
│       │   ├── events/             # Event tracking
│       │   ├── cases/              # Failure cases
│       │   ├── rca/                # RCA reports
│       │   └── rollback/           # Rollback API
│       └── services/
│           ├── workers/            # BullMQ workers
│           ├── rca/                # AI/LLM system
│           ├── rollback/           # Auto-rollback
│           └── github/             # GitHub API
└── sdks/core_backend_sdks/         # SDK packages
```

## Build Commands

```bash
# Frontend
cd xc-frontend && pnpm dev

# Backend
cd backends/back && pnpm dev
```

---

# Production Ready Guidelines

## Security Practices

### Authentication & Authorization
- All API routes require authentication (JWT via httpOnly cookies)
- Role-based access control (RBAC) implemented at middleware level
- Service-level permissions via `serviceRoleCheck` middleware
- API key validation for SDK ingest endpoint via `apiKeyGuard` middleware
- GitHub OAuth for user authentication

### Input Validation
- All inputs validated using Zod schemas in `*.validator.ts` files
- Strict type checking enabled in TypeScript (`strict: true`)
- No `any` types - use proper types or `unknown` with narrowing
- Sanitize all user inputs before database queries

### API Security
- CORS configured for production domains
- Rate limiting enabled on SDK endpoint (`apiKey.rateLimiter.ts`)
- Request validation on all endpoints
- Error messages don't expose internal system details

### Data Security
- Passwords/keys hashed before storage (SHA-256 for API keys)
- Sensitive data (GitHub tokens) encrypted at rest
- Database queries use parameterized queries (Prisma ORM)
- Environment variables for all secrets (`.env` files)

### Security Headers (Production)
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: ...
```

---

## Scalability Practices

### Database
- Prisma ORM with connection pooling
- Indexed queries (`@@index` on frequently queried fields)
- Pagination on all list endpoints (default: 20-50 items)
- Upsert patterns for deduplication

### Caching
- Redis for:
  - Error deduplication (10-second window)
  - Session tokens
  - Rate limiting counters
- Redis connection pooling

### Queue System (BullMQ)
- Worker concurrency limits (2-5 parallel jobs)
- Job retry with exponential backoff (3-5 attempts)
- Separate queues for different job types:
  - `failure_queue` - raw error processing
  - `failure_case_queue` - case management
  - `rca_queue` - AI analysis
  - `rollback_queue` - auto-rollback

### API Design
- RESTful endpoints with proper HTTP methods
- Pagination on all list endpoints
- Response compression (gzip)
- Async processing for long operations (workers)

### Horizontal Scaling
- Stateless API servers (session in Redis)
- Worker processes separate from API
- Database connection pooling
- CDN for static assets

---

## Production Readiness Checklist

### Code Quality
- [x] TypeScript strict mode enabled
- [x] ESLint with strict rules
- [x] No console.log in production code
- [x] Proper error handling in all async functions
- [x] Try-catch blocks with meaningful error messages

### Error Handling
- [x] Global error handler in Express (`server.ts`)
- [x] Custom error classes for different error types
- [x] Proper HTTP status codes (200, 400, 401, 403, 404, 500)
- [x] Error logging with stack traces (for debugging)
- [x] User-friendly error messages (no internal details)

### Validation
- [x] Zod schemas for all API inputs
- [x] Request validation in controllers
- [x] File upload validation (if applicable)
- [x] Query parameter validation

### Logging
- [x] Structured logging (JSON format in production)
- [x] Request/response logging (non-sensitive data)
- [x] Error logging with stack traces
- [x] Performance metrics logging

### Testing
- [ ] Unit tests for critical functions
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows

### Deployment
- [x] Environment-specific configs (`.env.dev`, `.env.prod`)
- [x] Graceful shutdown handling
- [x] Health check endpoint
- [x] Readiness probe

---

## Frontend Best Practices

### Component Patterns
- Use functional components with hooks
- Colocate related files (component + types + styles)
- Use composition over inheritance
- Memoize expensive computations (`useMemo`, `useCallback`)

### State Management
- React Query for server state (caching, invalidation)
- Local state for UI-only state (`useState`)
- Context for global UI state (theme, user)

### Performance
- Lazy loading for routes (`next/dynamic`)
- Image optimization (`next/image`)
- Code splitting by route
- Debounce search inputs
- Virtual scrolling for large lists

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Color contrast ratios (WCAG AA)

### Security
- Sanitize user inputs (prevent XSS)
- CSRF protection (Next.js built-in)
- No sensitive data in client-side code
- Proper auth token handling (httpOnly cookies)

---

## Monitoring & Observability

### Metrics to Track
- Request latency (p50, p95, p99)
- Error rate by endpoint
- Queue job processing time
- AI model inference time
- Database query latency

### Alerting
- High error rate (>1%)
- Queue backlog (>1000 pending)
- Worker failures
- API latency degradation

### Logging
- Structured JSON logs
- Request correlation IDs
- User/action context
- Stack traces for errors

---

## Code Review Checklist

Before merging any PR:
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] No security vulnerabilities
- [ ] Proper error handling
- [ ] Input validation
- [ ] Tests added/updated
- [ ] Documentation updated (if needed)
- [ ] Code follows project conventions
- [ ] No hardcoded secrets
- [ ] Performance implications considered
