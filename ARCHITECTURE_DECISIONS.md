# Architecture Decision Record — AgriSphere AI

> **What this document is.**
> An Architecture Decision Record (ADR) is the engineering team's single source of truth for *why* the system is built the way it is. Every time a significant design choice is made, it is recorded here with the decision, the reasoning, the alternatives considered, and the expected impact on future work.
>
> **Who should read this.**
> Every developer joining the project, any stakeholder reviewing the codebase, and anyone evaluating the engineering quality of AgriSphere AI — including hackathon judges, professors, and interviewers.
>
> **How to update this document.**
> When a new architectural decision is made — regardless of module — add a new numbered entry at the bottom following the same format. Never modify past decisions; if a decision is revised, add a new ADR entry that supersedes the old one, and link back to it.

---

## ADR Index

| # | Title | Status | Module | Date |
|---|---|---|---|---|
| ADR-001 | Backend Framework — FastAPI | ✅ Accepted | All | 2026-07 |
| ADR-002 | Clean Architecture + Layered Pattern | ✅ Accepted | All | 2026-07 |
| ADR-003 | Database Strategy — SQLite with Supabase Migration Path | ✅ Accepted | All | 2026-07 |
| ADR-004 | Repository Pattern for Data Access | ✅ Accepted | All | 2026-07 |
| ADR-005 | Standard API Response Envelope | ✅ Accepted | All | 2026-07 |
| ADR-006 | Centralized Exception Handling | ✅ Accepted | All | 2026-07 |
| ADR-007 | JWT Authentication Strategy | ✅ Accepted | Module 1 | 2026-07 |
| ADR-008 | Four-Role RBAC Model | ✅ Accepted | Module 1 | 2026-07 |
| ADR-009 | Single User Account with Role Field | ✅ Accepted | Module 1 | 2026-07 |
| ADR-010 | Password Hashing via Passlib + Bcrypt | ✅ Accepted | Module 1 | 2026-07 |
| ADR-011 | Language-First UX Design | ✅ Accepted | Module 1 | 2026-07 |
| ADR-012 | Lightweight Custom i18n System | ✅ Accepted | Module 1 | 2026-07 |
| ADR-013 | Frontend — Vanilla HTML/CSS/JS (Multi-Page) | ⛔ Superseded by ADR-021 | Module 1 | 2026-07 |
| ADR-014 | Isolated Admin Interface | ✅ Accepted | Module 1 | 2026-07 |
| ADR-015 | AI Engine Isolation from Business Logic | ✅ Accepted | All | 2026-07 |
| ADR-016 | Soft Delete for User Records | ✅ Accepted | Module 1 | 2026-07 |
| ADR-017 | Seeded Admin Account on Startup | ✅ Accepted | Module 1 | 2026-07 |
| ADR-018 | Farmer-Friendly UI Design Principles | ✅ Accepted | Module 1 | 2026-07 |
| ADR-019 | Centralized Configuration via Settings Class | ✅ Accepted | All | 2026-07 |
| ADR-020 | Refresh Token Architecture (Future-Ready) | 🔵 Planned | Module 1+ | 2026-07 |
| ADR-021 | React + Vite Frontend Migration & Architecture Freeze | ✅ Accepted | All | 2026-07 |
| ADR-022 | AI Session Container Architecture (`AISession`) | ✅ Accepted | Module 3 | 2026-07 |
| ADR-023 | Disease Knowledge Base Grounding & Gemini Hybrid Advisory | ✅ Accepted | Module 3 | 2026-07 |
| ADR-024 | Model Registry Abstraction & 10-Subsystem Architecture | ✅ Accepted | Module 3 | 2026-07 |



---

## ADR-001 — Backend Framework: FastAPI

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
We needed a Python web framework for an AI-heavy agricultural platform where performance, developer speed, and automatic API documentation matter.

### Decision
We chose **FastAPI** as the backend framework.

### Rationale
- **Auto-generated OpenAPI docs** at `/docs` — critical for a hackathon where judges and reviewers need to explore the API instantly without extra tooling.
- **Native async support** — important for I/O-bound operations like weather API calls and database reads that will scale in production.
- **Pydantic integration** — request/response validation is built-in, not bolted on. Every endpoint is self-documenting and self-validating.
- **Dependency Injection via `Depends()`** — makes auth guards, DB sessions, and role checks composable without cluttering route handlers.
- **FastAPI is production-grade** — used by Microsoft, Uber, Netflix internal tools. Not a prototype framework.

### Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| **Flask** | No native async, no built-in validation, manual OpenAPI setup |
| **Django REST Framework** | Too heavyweight for a modular AI system; ORM coupling is too tight |
| **Litestar** | Less community support, smaller ecosystem |

### Impact on Future Modules
- All future AI endpoints (disease scan, grain quality, yield prediction) benefit from FastAPI's multipart file upload handling and async model inference.
- The `Depends()` pattern used for auth in Module 1 seamlessly extends to per-module permission guards.

---

## ADR-002 — Clean Architecture + Layered Pattern

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
The original hackathon codebase risk was "one giant file" syndrome — mixing routes, business logic, AI inference, and database queries in a single module. This breaks when modules multiply from 1 to 4+.

### Decision
Enforce a strict **four-layer Clean Architecture**:

```
API Layer      (app/api/)         ← HTTP contracts only
Service Layer  (app/services/)    ← Business rules only
Repository Layer (app/repositories/) ← Data access only
Database Layer (app/database/, app/models/) ← Schema only
```

Additionally, **AI engines** (app/ai/) are isolated from all four layers and are called only from the Service Layer via explicit function calls.

### Rationale
- **Single Responsibility Principle**: each layer has exactly one reason to change. If the DB switches from SQLite to Supabase, only the repository layer changes. If business rules change, only the service layer changes.
- **Testability**: Service logic can be unit-tested by mocking the Repository. API routes can be tested by mocking the Service.
- **Onboarding speed**: A new developer opening `app/api/auth.py` immediately understands it only handles HTTP — no hidden side effects.

### Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| **Fat routers** (put everything in routes) | Kills testability, creates spaghetti at scale |
| **Django's MVT** | Couples ORM to views; wrong fit for API-first design |
| **Microservices** | Overkill for a 4-module platform; adds network latency and deployment complexity with no benefit at current scale |

### Impact on Future Modules
- Modules 2 (Disease Detection), 3 (Grain Quality), 4 (Equipment Marketplace) already follow this pattern. Adding Module 5+ requires only adding files in the correct layer — no architectural rewrites.
- The AI layer isolation means swapping a heuristic OpenCV engine for a trained ONNX model is a single-file swap without touching routes or repositories.

---

## ADR-003 — Database Strategy: SQLite with Supabase Migration Path

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
We need a database that works with zero infrastructure setup for hackathon demos, while being replaceable with a production PostgreSQL/Supabase instance for deployment without code changes.

### Decision
Use **SQLite** as the default local database, with **SQLAlchemy ORM** abstracting the connection. The single environment variable `DATABASE_URL` controls which database is used.

```python
# Switching to Supabase PostgreSQL is literally one line in .env:
DATABASE_URL=postgresql://user:pass@db.supabase.co/agrisphere
```

### Rationale
- **Zero setup** for judges, reviewers, and new developers — `pip install` + `uvicorn` is the entire setup.
- **SQLAlchemy abstracts the dialect** — all queries, models, and migrations work identically across SQLite and PostgreSQL.
- **Supabase is the production target** — it offers PostgreSQL with built-in auth, row-level security, and real-time subscriptions which align with the platform's future roadmap.

### Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| **PostgreSQL from the start** | Requires local server installation or remote connection for local dev — adds friction |

| **MongoDB** | Schema-less approach fights against our structured agricultural data (crop types, grain grades, booking states) |
| **Supabase directly from day one** | Requires internet + API keys in dev — breaks offline development and hackathon demos |

### Impact on Future Modules
- Alembic migrations (planned) will generate SQL that runs on both dialects.
- Supabase Row Level Security (RLS) in production will enforce data isolation between farmers without application-layer code changes.
- The `DATABASE_URL` swap is the only production deployment step for the database layer.

---

## ADR-004 — Repository Pattern for Data Access

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
Without a clear boundary for data access, SQLAlchemy queries leak into service methods and route handlers, making the codebase impossible to test without a live database.

### Decision
All database access is contained exclusively within **Repository classes** in `app/repositories/`. No other layer (service, route, middleware) ever calls `db.query()` or `db.add()` directly.

```python
# CORRECT: Route → Service → Repository → DB
result = user_service.login(db, phone, password)

# FORBIDDEN: Route calling DB directly
user = db.query(User).filter(User.phone == phone).first()
```

### Rationale
- **Testability**: Services can be tested by injecting a mock repository — no SQLite file required.
- **Swap-ability**: If we move to Supabase's Python SDK instead of SQLAlchemy, only the repository implementations change.
- **Readability**: `user_repository.get_by_phone(db, phone)` is self-documenting; a raw query is not.

### Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| **Active Record pattern** (Django ORM style) | Tightly couples model to query logic; hard to mock |
| **Direct DB access in routes** | Breaks separation of concerns, makes unit testing impossible |
| **ORM sessions in service layer** | Mixes data access with business logic |

### Impact on Future Modules
Every future model (crop records, yield predictions, market prices) will have a corresponding repository. The pattern is already established and documented.

---

## ADR-005 — Standard API Response Envelope

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
Inconsistent API responses force frontend developers to write defensive code for every endpoint. Judges and external API consumers cannot rely on a predictable schema.

### Decision
Every API endpoint — success or failure — returns the same JSON envelope:

```json
{
  "success": true | false,
  "message": "Human-readable summary",
  "data": {} | [] | null,
  "errors": null | {},
  "timestamp": "2026-07-31T07:30:00Z"
}
```

This is enforced by two factory functions in `app/core/responses.py`:
- `success_response(data, message, status_code)` — for all successful responses
- `error_response(message, status_code, errors)` — called only by the global exception handler

### Rationale
- **Frontend predictability**: The JavaScript fetch wrapper only needs to handle one shape. `if (result.success)` works everywhere.
- **Error transparency**: `errors` field carries Pydantic validation errors or domain-specific error details without breaking the contract.
- **Debuggability**: The `timestamp` field makes log correlation trivial.

### Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| **Per-endpoint response schemas** | Each endpoint becomes a snowflake; frontend needs custom handling for each |
| **HTTP status codes only** | Status codes don't carry enough context for rich error messages in a multilingual app |
| **GraphQL** | Too heavyweight; adds a schema layer that's not justified at current complexity |

### Impact on Future Modules
- The frontend `api.js` utility is built once and used everywhere.
- New endpoints are guaranteed compliant by calling `success_response()` — zero additional effort.
- Mobile apps (future) can rely on this contract without versioning the response shape.

---

## ADR-006 — Centralized Exception Handling

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
Scattered `try/except` blocks in route handlers create inconsistent error responses and duplicate logging code. Services need a clean way to signal domain errors without knowing about HTTP.

### Decision
Services and repositories raise **domain exceptions** from `app/core/exceptions.py`. A single global exception handler in the same module catches all exceptions and converts them to the standard error envelope. Routes never catch exceptions.

```python
# Service raises domain exception:
raise NotFoundException("Equipment not found")

# Global handler converts it — zero code in the route:
→ HTTP 404 { "success": false, "message": "Equipment not found" }
```

Defined exception hierarchy:
- `AppException` (base, HTTP 400)
  - `NotFoundException` (404)
  - `ConflictException` (409)
  - `UnauthorizedException` (401)
  - `ForbiddenException` (403)
  - `ValidationException` (422)
  - `AuthenticationException` (401)
  - `PermissionDeniedException` (403)

### Rationale
- **Single responsibility**: Routes handle routing; exceptions handle error responses.
- **Consistency**: Every error, from any layer, produces the same envelope shape.
- **Auditability**: All errors flow through one handler with one logging statement.

### Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| **try/except in every route** | Massive duplication; different devs return different shapes |
| **HTTP exceptions directly in services** | Services shouldn't know they're running inside an HTTP server |

### Impact on Future Modules
All future modules inherit this behavior automatically. No additional error-handling code needed in new routes.

---

## ADR-007 — JWT Authentication Strategy

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
The prototype used phone-number-only login with no password. Module 1 requires real authentication with password verification and role-based access.

### Decision
**JWT (JSON Web Tokens)** with `pyjwt` for stateless authentication. The access token payload contains:

```json
{
  "sub": "usr_abc123",
  "phone": "+919876543210",
  "role": "farmer",
  "exp": 1754000000
}
```

Two-token architecture:
- **Access token** — short-lived (60 minutes), used for every API request
- **Refresh token** — long-lived (30 days), stored in DB, used to rotate access tokens (implementation planned, model already created)

### Rationale
- **Stateless access tokens** — the backend doesn't need a DB lookup to validate every API call. The role claim in the token lets the frontend route immediately to the correct dashboard.
- **Role in payload** — eliminates an extra `/me` API call after login; frontend knows the role instantly.
- **Refresh token in DB** — allows token revocation (logout from all devices, account suspension) which pure stateless JWT cannot do.

### Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| **Session-based auth** | Requires server-side session store; breaks horizontal scaling |
| **Supabase Auth OTP** | No password, phone-only — right for production India but requires paid Twilio in dev |
| **OAuth2 / Social Login** | Farmers don't have Google/Facebook accounts consistently; adds complexity without benefit |
| **API Keys** | Not user-friendly; no logout mechanism |

### Impact on Future Modules
- Every protected endpoint uses `Depends(get_current_user)` — one line of code, zero duplication.
- `require_role("admin")` dependency blocks unauthorized role access at the API layer before any business logic runs.
- When Supabase Auth is added in production, only `security.py` changes — no route changes.

---

## ADR-008 — Four-Role RBAC Model

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
The platform serves four distinct user types with completely different UI needs and data access rights. Too many roles create management complexity; too few create UI clutter.

### Decision
Implement exactly **four roles**, no more:

| Role | Access Level | Primary Interface |
|---|---|---|
| `farmer` | Own data, AI tools, equipment booking | Farmer Dashboard |
| `equipment_owner` | Own listings, bookings, earnings | Equipment Owner section of dashboard |
| `both` | All farmer + equipment owner features | Combined dashboard |
| `admin` | Full platform access, all user data | Admin Dashboard (isolated) |

### Rationale
- **Real-world alignment**: A farmer who owns a tractor should not need two accounts. The `both` role reflects the ground reality of rural India where the same person wears multiple hats.
- **UI clarity**: Role drives which sections of the dashboard are visible. A `farmer` never sees "Manage Listings." An `equipment_owner` doesn't see "Scan Crop."
- **Extensibility**: Adding a `buyer`/`trader` role in a future module requires only a new enum value and new route guards — no schema changes.

### Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| **8+ granular roles** | Over-engineers for current scale; confuses users during registration |
| **Permission flags per user** | More flexible but requires a permissions table; too complex for current needs |
| **Two separate accounts for farmer + equipment owner** | Forces real farmers to manage two login sessions; rejected by UX research |

### Impact on Future Modules
- Module 4 (Equipment Marketplace) is role-gated: equipment listing management is only visible to `equipment_owner` and `both` users.
- Future `buyer` role for the crop marketplace can be added as a new enum value without touching existing auth logic.

---

## ADR-009 — Single User Account with Role Field

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
Early designs considered separate `Farmer`, `EquipmentOwner`, and `Admin` tables. This creates duplication — multiple tables for what is fundamentally one concept: a person using the platform.

### Decision
A **single `users` table** with a `role` column. All authentication, profile management, and settings live in this one table.

```sql
CREATE TABLE users (
  id            VARCHAR PRIMARY KEY,
  full_name     VARCHAR NOT NULL,
  phone         VARCHAR UNIQUE NOT NULL,
  email         VARCHAR UNIQUE,
  password_hash VARCHAR NOT NULL,
  role          VARCHAR NOT NULL,  -- farmer|equipment_owner|both|admin
  language      VARCHAR DEFAULT 'en',
  district      VARCHAR,
  village       VARCHAR,
  state         VARCHAR,
  status        VARCHAR DEFAULT 'active',
  last_login_at DATETIME,
  created_at    DATETIME,
  updated_at    DATETIME,
  is_deleted    BOOLEAN DEFAULT FALSE
);
```

### Rationale
- **No data duplication**: Name, phone, language, location stored once.
- **Simple login flow**: One `POST /auth/login` endpoint handles all user types — the role determines what happens after.
- **Simpler joins**: Equipment and Bookings join to `users.id` regardless of what role that user has.

### Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| **Separate tables per role** | Duplicate auth columns in every table; complex queries to fetch "any user" |
| **User + Profile pattern** | Adds a join for every profile fetch; justified only when profiles are vastly different |

### Impact on Future Modules
- All foreign keys in equipment listings, bookings, scan records point to `users.id`.
- Role changes (e.g., a farmer who adds equipment) require only updating the `role` field — no data migration.

---

## ADR-010 — Password Hashing via Passlib + Bcrypt

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
The prototype stored no passwords (phone-only login). Module 1 adds password authentication, requiring a secure hashing strategy.

### Decision
Use **passlib with bcrypt** for password hashing.

```python
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

### Rationale
- **Bcrypt is adaptive** — the cost factor can be increased as hardware improves without rehashing existing passwords.
- **Passlib handles salt automatically** — no risk of salt reuse bugs.
- **FastAPI's official security docs recommend this exact setup** — well-documented, well-maintained.
- **No MD5/SHA1/SHA256** — these are cryptographic hash functions, not password hashing functions. They are fast by design, which makes them catastrophically weak for passwords.

### Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| **SHA-256** | Not designed for passwords; too fast; vulnerable to GPU brute force |
| **Argon2** | Excellent, but adds the `argon2-cffi` dependency; bcrypt is sufficient for current scale |
| **PBKDF2** | Standard but passlib/bcrypt is the de facto FastAPI convention |

### Impact on Future Modules
- OTP/passwordless flow (planned with Supabase Auth) will replace this entirely — but the passlib layer means the swap is one function change in `security.py`.

---

## ADR-011 — Language-First UX Design

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team + UX Review

### Context
AgriSphere AI's primary users are farmers in rural India who may not be comfortable with English. An English-first interface is an immediate barrier that causes user abandonment before the first interaction.

### Decision
The **very first screen** a user sees is a language selection page — before login, before registration, before anything else.

```
AgriSphere AI
Choose Your Language / अपनी भाषा चुनें

[ 🇬🇧  English    ]
[ 🇮🇳  हिन्दी     ]
[ 🇮🇳  తెలుగు    ]
[ 🇮🇳  ಕನ್ನಡ     ]
```

Selected language is stored in `localStorage` immediately. All subsequent pages render in the chosen language. A language toggle remains accessible in the navbar at all times.

### Rationale
- **User dignity**: Being greeted in your language from the first interaction signals that the product was built for you.
- **Dropout reduction**: Registration forms in native language significantly reduce form abandonment in rural digital products.
- **Persistence**: `localStorage` ensures the language survives page navigation without requiring login.
- **Andhra Pradesh + Karnataka focus**: Telugu and Kannada are the primary regional languages for the target geography.

### Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| **English default, language option in settings** | Most users will never find settings; high dropout |
| **Auto-detect from browser locale** | Browser locale in rural India often defaults to English; unreliable |
| **Language tied to user profile after login** | Means the login page itself is in an unfamiliar language |

### Impact on Future Modules
- Voice assistant (planned) must respect the language stored in `localStorage`/user profile.
- AI notifications (disease alerts, price alerts) are generated in the user's stored `preferred_language`.
- Any new language can be added by adding a `lang/xx.js` file — no component changes.

---

## ADR-012 — Lightweight Custom i18n System

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
Full i18n libraries (i18next, FormatJS) add significant JS bundle size and configuration complexity. The frontend is vanilla HTML/JS — a 50KB i18n library is disproportionate.

### Decision
Build a **minimal custom i18n module** (`assets/js/i18n.js`) that:
1. Loads a language dictionary from `lang/{code}.js` (en, te, hi, kn)
2. Applies translations by scanning DOM elements with `data-i18n="key"` attributes
3. Stores the active language in `localStorage`
4. Exposes `t(key)` for dynamic JS string interpolation

```html
<!-- HTML usage -->
<button data-i18n="scan_crop">Scan Crop</button>

<!-- JS usage -->
showToast(t("login_success"));
```

```js
// lang/te.js
export default {
  scan_crop: "పంటను స్కాన్ చేయండి",
  login_success: "విజయవంతంగా లాగిన్ అయ్యారు",
  // ...
}
```

### Rationale
- **Zero dependencies** — no npm, no CDN, no build step needed for i18n.
- **HTML-first approach** — designers can add `data-i18n` without touching JS.
- **< 5KB total** — all four language files combined are smaller than most single i18n library chunks.
- **Maintainable** — adding a new language is adding one file. No config to update.

### Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| **i18next** | 50KB+ dependency for vanilla HTML; designed for React/Angular ecosystems |
| **Hardcoded per-language HTML files** | 4× the HTML to maintain; translations drift immediately |
| **Server-side rendering per language** | Adds backend complexity; language changes require a page reload from server |

### Impact on Future Modules
Every new page uses the same `data-i18n` pattern. No new i18n setup per module — just add keys to `lang/*.js`.

---

## ADR-013 — Frontend: Vanilla HTML/CSS/JS (Multi-Page Architecture)

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
The specification listed React as the frontend framework, but the existing project is a single vanilla HTML file with no build tooling. Migrating to React mid-project introduces a full build pipeline, npm dependency tree, and JavaScript ecosystem complexity that slows down an already scoped hackathon timeline.

### Decision
Continue with **vanilla HTML/CSS/JS** but restructure from one file into a **multi-page architecture**:

```
frontend/
  index.html          ← Language selection
  login.html          ← Farmer/User login
  register.html       ← Registration
  dashboard.html      ← Farmer SPA
  admin-login.html    ← Admin login (isolated)
  admin.html          ← Admin dashboard
  assets/
    css/              ← Design system files
    js/               ← Utilities, auth, i18n, API
```

Each page is a separate HTML file. Navigation is standard `<a href>` links. The dashboard page contains the in-page tab/screen navigation (existing SPA behavior preserved).

### Rationale
- **No build tooling** — `uvicorn` serves everything. No webpack, vite, or npm required.
- **Farmer-friendly URL structure** — `dashboard.html` is a bookmarkable, shareable URL.
- **Admin isolation** — `admin.html` and `admin-login.html` are literally separate files; a CSS bug on the farmer dashboard cannot affect the admin UI.
- **Existing work preserved** — the 1012-line `index.html` SPA logic migrates into `dashboard.html` with minimal rewriting.
- **Performance** — browser parses only the HTML for the current page; no JS framework bootstrapping overhead.

### Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| **React + Vite** | Correct long-term choice, but mid-project migration costs > 2 days; out of scope for Module 1 |
| **Single giant HTML file** | Current approach; cannot support proper login/admin flows without massive JS complexity |
| **Vue.js CDN** | Simpler than React but still adds a framework layer; unnecessary for the scope |

### Impact on Future Modules
- If React migration is desired for Module 2+, each `*.html` page becomes one React component/route. The migration can be done incrementally.
- Shared `assets/js/api.js` and `assets/js/auth.js` will translate directly to React hooks.

---

## ADR-014 — Isolated Admin Interface

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
Mixing admin and farmer UI into the same navigation creates security risks (an admin widget rendered to a farmer by a bug), visual confusion, and maintenance complexity.

### Decision
The admin interface is **completely isolated** at every level:
- **Separate HTML files**: `admin-login.html`, `admin.html`
- **Separate CSS theme**: Dark/professional color scheme vs. farmer's warm earth tones
- **Separate API prefix**: `/api/v1/admin/*` — all admin routes are in their own router
- **Separate login flow**: Admin logs in via `admin-login.html`; the farmer login route returns 403 if an admin account attempts to use it

The `require_role("admin")` dependency is applied to every admin route, so even if a farmer's JWT is somehow presented to an admin endpoint, it is rejected at the dependency level before any business logic runs.

### Rationale
- **Defense in depth**: Multiple layers prevent admin capabilities leaking to farmer users.
- **Visual clarity**: Judges and evaluators immediately understand "this is the admin view" vs. "this is the farmer view."
- **Future-ready**: Admin dashboard can evolve independently — add React, charts, tables — without touching the farmer UI.

### Impact on Future Modules
- Admin analytics for AI predictions (Module 2+) will be added to `admin.html` without touching `dashboard.html`.
- Role-based API guards are already in place; adding a new admin endpoint requires only adding the route with `Depends(require_role("admin"))`.

---

## ADR-015 — AI Engine Isolation from Business Logic

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
AI/ML code has completely different concerns from business logic: it deals with tensors, model files, image preprocessing, and inference pipelines — not with user IDs, database sessions, or HTTP status codes.

### Decision
All AI/ML code lives exclusively in `app/ai/`. Services call AI engines via explicit function calls. AI engines receive plain Python data (numpy arrays, strings, floats) and return plain Python data. They never receive SQLAlchemy sessions, Pydantic models, or HTTP requests.

```
app/ai/
  disease_engine.py   ← OpenCV disease heuristics (→ ONNX model in production)
  grain_engine.py     ← OpenCV grain quality analysis
  market_engine.py    ← Market price simulation (→ LightGBM in production)
  speech_engine.py    ← Voice alert text generation

# Service calls the engine:
result = disease_engine.analyze(image_array)
# Engine never knows about HTTP, DB, or users.
```

### Rationale
- **Swappable models**: The heuristic `disease_engine.py` can be replaced by a YOLOv8 ONNX model without any changes to `disease_service.py` or `api/disease.py`.
- **Testable without GPU**: AI engine tests can run on CPU with small test images.
- **Independent scaling**: In production, AI engines can be extracted into separate microservices (inference servers) while services/routes remain unchanged.

### Impact on Future Modules
- Yield prediction, satellite NDVI analysis, and voice synthesis are future AI engines that follow the same `app/ai/` pattern.
- Model versioning and A/B testing of AI models happens inside `app/ai/` with zero impact on API contracts.

---

## ADR-016 — Soft Delete for User Records

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
Deleting user records permanently breaks foreign key references in equipment listings, bookings, and scan records. It also makes compliance and audit trails impossible.

### Decision
User records are **never physically deleted**. Instead, the `is_deleted` boolean flag is set to `True`. All user queries include a `WHERE is_deleted = FALSE` filter by default in the repository layer.

Admin "delete" action sets `is_deleted = True` and `status = 'suspended'`.

### Rationale
- **Referential integrity**: Bookings, equipment, scan records remain valid after user "deletion."
- **Audit trail**: The user record persists for compliance review.
- **Reversibility**: A mistakenly "deleted" account can be restored by an admin.
- **GDPR-ready**: Personal data can be anonymized (name → "Deleted User", phone → null) while the record skeleton persists.

### Impact on Future Modules
- All future models with user-facing records (crop profiles, yield predictions) benefit from the same pattern.
- Reporting and analytics always have complete historical data.

---

## ADR-017 — Seeded Admin Account on Startup

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
The admin interface requires an admin account to exist in the database. Manual creation is error-prone; migration scripts are fragile. A fresh deployment must have a usable admin account immediately.

### Decision
On application startup (`on_startup` event in `main.py`), the system checks for a user with `role = 'admin'`. If none exists, it creates one from environment variables:

```python
ADMIN_EMAIL=admin@agrisphere.ai
ADMIN_PASSWORD=your_secure_password_here
ADMIN_NAME=AgriSphere Admin
```

This seed only runs if no admin exists — subsequent restarts are no-ops.

### Rationale
- **Zero-touch deployment**: Any environment (local, staging, Render) gets a working admin account without manual SQL scripts.
- **Environment-controlled**: Credentials come from `.env`, never hardcoded.
- **Idempotent**: Running it 100 times produces exactly one admin account.

### Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| **Manual SQL insert** | Error-prone; different steps for SQLite vs. Postgres |
| **Alembic data migration** | Correct for production but adds tooling dependency in development |
| **Hardcoded admin credentials** | Security vulnerability; cannot be changed without code edit |

### Impact on Future Modules
No impact — this is a one-time startup concern. Future modules may use the same pattern for seeding reference data (crop types, equipment categories).

---

## ADR-018 — Farmer-Friendly UI Design Principles

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team + UX Review

### Context
AgriSphere AI's primary users (farmers) represent a wide digital literacy range. Many users will be first-time smartphone users. A UI designed for tech-savvy urban users will fail this audience.

### Decision
All farmer-facing UI must follow these non-negotiable principles:

| Principle | Implementation |
|---|---|
| **Large touch targets** | All buttons minimum 48px height; primary actions minimum 56px |
| **Large base font** | 18–20px for body text; 16px absolute minimum |
| **Icon + text labels** | No icon-only buttons; every action has both 📷 + "Scan Crop" |
| **Simple language** | "Scan Crop" not "Disease Detection"; "Rent Equipment" not "Equipment Marketplace" |
| **High contrast** | Background to text contrast ratio ≥ 4.5:1 (WCAG AA) |
| **No hamburger menus** | Primary actions in fixed bottom navigation bar |
| **Minimal typing** | Registration: 6 fields max on page 1; dropdowns for region/language |
| **Mobile-first layout** | Max width 480px; designed for phone-sized screens first |

### Rationale
- **Usability research**: Studies on digital agricultural platforms in India show that UI complexity is the primary driver of abandonment.
- **Competitive differentiation**: Most agri-tech apps are designed by and for urban developers — this is a genuine differentiator.
- **Hackathon impact**: Judges evaluating with a farmer persona will immediately feel the thoughtfulness.

### Impact on Future Modules
- Module 2 (Disease Scan): The scan UI must use large camera icon + "Take Photo" — not a file input.
- Module 3 (Grain Quality): Results must be color-coded (green/yellow/red) + plain language summary, not technical metrics only.
- Module 4 (Equipment): Booking confirmation must be one tap, not a multi-step wizard.

---

## ADR-019 — Centralized Configuration via Settings Class

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
Scattered `os.getenv()` calls throughout the codebase create two problems: (1) missing env vars fail silently at runtime in unexpected places, and (2) changing a configuration key requires grep-and-replace across multiple files.

### Decision
All configuration is read exactly once in `app/core/config.py` through a `Settings` class. Everywhere else in the codebase uses `from .core.config import settings`.

```python
# CORRECT:
from .core.config import settings
jwt_secret = settings.JWT_SECRET

# FORBIDDEN:
import os
jwt_secret = os.getenv("JWT_SECRET")
```

The `Settings` class uses `@lru_cache` to guarantee it is instantiated once per process.

### Rationale
- **Fail-fast**: Missing required env vars raise at import time, not at the moment of use.
- **Single source of truth**: Every default, every env var name, documented in one place.
- **Refactoring safety**: Renaming `JWT_SECRET` to `AUTH_SECRET_KEY` requires changing exactly one file.

### Impact on Future Modules
New configuration (API keys, rate limits, feature flags) for Modules 2–4 are added to `Settings` — never scattered in service files.

---

## ADR-020 — Refresh Token Architecture (Future-Ready)

**Status:** Planned  
**Date:** 2026-07  
**Deciders:** Engineering Team

### Context
Short-lived access tokens (60 min) require users to re-login frequently. Long-lived access tokens are a security risk if intercepted. The solution is a two-token system.

### Decision (Planned)
The `refresh_tokens` table is created in Module 1 for future implementation. The schema supports:
- One refresh token per device (device fingerprint stored)
- Token rotation on use (old token invalidated when new one is issued)
- All tokens invalidated on password change or account suspension

The actual `POST /auth/refresh` endpoint will be implemented when the mobile app is developed, since browser sessions have different lifecycle expectations.

### Rationale
- **Creating the table now** costs nothing but prevents a schema migration later.
- **Token rotation** means a stolen refresh token is invalidated the moment the real user refreshes.
- **Account suspension** immediately blocks all sessions via DB-side token invalidation.

### Impact on Future Modules
- Mobile app (future) uses refresh tokens transparently.
- The `POST /auth/logout` endpoint already marks the current session as invalid in the refresh token table even before rotation is implemented.

---

## ADR-021 — React + Vite Frontend Migration & Architecture Freeze

**Status:** Accepted (Supersedes ADR-013)  
**Date:** 2026-07  
**Deciders:** Senior Frontend Architect & Engineering Team

### Context
While AgriSphere AI began as a multi-page HTML prototype, scaling to 15+ features (Weather, Yield, Disease, Grain, Marketplace, Admin) required reusable component structures, lazy-loaded client routing, strong i18n localization, and isolated API layers without altering the established high-contrast farmer UI design.

### Decision
1. **Migrate to React + Vite**: Built a React 18 + Vite SPA residing in `frontend/`.
2. **Modular CSS Token Architecture**: Split global CSS into `tokens.css`, `variables.css`, `buttons.css`, `cards.css`, `forms.css`, `navbar.css`, `layout.css`, `animations.css`, and `utilities.css`.
3. **Dedicated Asset & Component Hierarchies**: Created structured asset directories (`assets/images/`, `icons/`, `illustrations/`, `logos/`, `animations/`, `sounds/`) and dedicated farmer components (`CropCard`, `FarmCard`, `AIRecommendation`, `WeatherAdvice`, `PredictionCard`).
4. **Resilient UX**: Implemented `Skeleton` loaders for smooth loading states and dedicated React Error Pages (`401`, `403`, `404`, `500`).
5. **Form Validation & Permission Layer**: Separated schema validation (`src/validation/`) and permission definitions (`PERMISSIONS` role matrix).
6. **Feature Flags & Global Constants**: Added `FEATURE_FLAGS` and modularized constants (`routes.js`, `roles.js`, `languages.js`, `api.js`, `storageKeys.js`, `icons.js`).
7. **Frontend Architecture Freeze**: Locked down folder structure, routing, state management, and design system. Future modules plug directly into this established architecture without structural refactoring.

### Rationale
- **Zero Visual Regression**: Design tokens and farmer-first UX principles are strictly preserved.
- **Maintainability & Stability**: Clear separation between API, UI, validation, and permissions ensures predictable module extensions.

### Impact on Future Modules
- All upcoming modules plug into existing components and route definitions without altering core layout or architecture.

---

## ADR-022 — AI Session Container Architecture (`AISession`)

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Senior AI Architect & Database Architect  

### Context
Treating crop scans as isolated one-off image classification requests limits historical analytics, progression tracking, and multi-step decision support.

### Decision
Model all crop intelligence workflows under a unified `AISession` container (`ai_sessions` table). An `AISession` encapsulates:
`AISession` → `CropScan` → `DiseasePrediction` → `TreatmentRecommendation` → `Comparison` → `VoiceAdvisory`.

### Rationale
- Grouping related events under a session ID makes history, analytics, and side-by-side scan comparisons deterministic and straightforward.

---

## ADR-023 — Disease Knowledge Base Grounding & Gemini Hybrid Advisory

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** ML Engineering & Agronomy Domain Leads  

### Context
Relying solely on LLM / Gemini prompts for disease advice risks hallucination or unverified chemical dosages.

### Decision
Build a static, grounded **Disease Knowledge Base (`disease_kb.py`)** containing official ICAR / KVK agricultural extension protocols for major Indian crop diseases. Combine this grounded knowledge with Gemini 1.5 Flash synthesis to guarantee verified chemical dosages, spray windows, and cultural practices.

---

## ADR-024 — Model Registry Abstraction & 10-Subsystem Architecture

**Status:** Accepted  
**Date:** 2026-07  
**Deciders:** Software Architect & AI Architecture Lead  

### Context
Hardcoding computer vision models inside router endpoints prevents upgrading to newer vision models (e.g. YOLO11, EfficientNet, Gemini Vision) without breaking changes.

### Decision
1. **Model Registry Pattern (`model_registry.py`)**: Abstract vision model prediction behind a `BaseCropModel` interface. YOLOv8n-cls + OpenCV serves as default, supporting zero-code-change model swapping.
2. **10 Subsystems Pipeline**: Split Crop Intelligence into 10 explicit subsystems (`Image Processing`, `Model Registry`, `Inference Pipeline`, `Confidence Engine`, `Disease Knowledge Base`, `Advisory Engine`, `Recommendation Engine`, `History Engine`, `Comparison Engine`, `Voice Advisory`).

---

## How to Add a New ADR

When making a significant design decision, add a new entry following this template:

```markdown
## ADR-XXX — [Short Title]

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-YYY
**Date:** YYYY-MM
**Deciders:** [Who made this decision]

### Context
[What problem or situation led to this decision?]

### Decision
[What was decided? Be specific.]

### Rationale
[Why was this the right choice? Use data, principles, or precedent.]

### Alternatives Considered
| Alternative | Why Rejected |
|---|---|
| ... | ... |

### Impact on Future Modules
[What does this decision constrain or enable for future development?]
```

## ADR-026 — Equipment Marketplace & Event-Driven Notification Engine Architecture

**Status:** Accepted  
**Date:** 2026-07-31  
**Deciders:** AgriSphere AI Core Team  

### Context
Module 5 introduces the Farm Resource Hub & Equipment Marketplace along with a platform-wide notification system. Equipment rentals require double-booking prevention, owner decision flows, operator options, direct communication channels, and real-time status visibility across the platform.

### Decision
1. **6 Backend Service Modules (`backend/app/services/resource/`)**:
   - `equipment_service.py`: Equipment CRUD, availability toggle (`is_available`), and `Verified Owner ✔️` badge.
   - `booking_service.py`: Booking request lifecycle (`Pending` → `Accepted` → `In Progress` → `Completed` / `Rejected`).
   - `availability_service.py`: Overlap checking (`has_booking_overlap`) preventing double bookings.
   - `notification_service.py`: Platform-wide event notification engine.
   - `search_service.py`: Multi-filter search (category, district, village, operator, price) with sorting (`lowest_price`, `highest_price`, `newest`).
   - `owner_dashboard_service.py`: Clean operational metrics (Total Listings, Pending Requests, Accepted Bookings, Completed Rentals — *no fake income*).
2. **Normalized User Ownership**: Equipment maps directly to `owner_id` (joining with `Farmer` records for dynamic names and phone numbers).
3. **Truthful Naming & Direct Channels**:
   - Rental document named **Rental Confirmation** / **Booking Confirmation** (no payment claims).
   - Deep links for `Call` (`tel:+91...`) and `WhatsApp` (`https://wa.me/...` with prefilled context message).
4. **Event-Driven Notification Engine**: Dispatches platform notifications for `BOOKING_REQUEST`, `BOOKING_ACCEPTED`, `BOOKING_REJECTED`, `BOOKING_COMPLETED`, `CROP_SCAN`, and `GRAIN_PASSPORT`.

### Rationale
- **High Friction Reduction**: Direct Call & WhatsApp links allow rural farmers to communicate instantly with verified equipment owners.
- **Data Integrity**: Double-booking overlap checking prevents date collisions.
- **Truthful UX**: Truthful naming (Rental Confirmation vs. Payment Receipt) and operational metrics maintain credibility during hackathon evaluation.

### Impact on Future Modules
- The event-driven notification engine is reusable by any future system module or government update alert.

---

*This document is maintained by the AgriSphere AI engineering team. Last updated: 2026-07-31.*



