# Backend Handoff

The frontend is now separated from its data source. Pages no longer import fixture arrays directly; they consume a typed data context backed by a repository.

## The data layer

| File | Responsibility |
|---|---|
| `src/data/types.ts` | Canonical domain types: `Institution`, `CaseRecord`, `Overlap`, `IncomingComplaint`, `TimelineEvent`, etc. |
| `src/data/repository.ts` | `SamanvayRepository` interface — the contract every backend adapter must satisfy. |
| `src/data/mockRepository.ts` | Async in-memory demo implementation. Mutations persist for the session. |
| `src/data/httpRepository.ts` | Fetch-based implementation for a real API. |
| `src/data/DataProvider.tsx` | Loads data once, exposes entity lookups and mutation methods, handles loading/error states. |
| `src/data/index.ts` | Chooses mock vs. API mode from environment variables. |

### Switching modes

```bash
# Demo mode (default)
VITE_DATA_MODE=mock pnpm dev

# API mode
VITE_DATA_MODE=api \
VITE_API_BASE_URL=http://localhost:4000/api \
pnpm dev
```

Copy `.env.example` to `.env.local` for local overrides.

When API mode is selected, the app shows a branded “connection problem” screen if the API is unreachable, with a retry action. It does not silently fall back to mock data.

---

## API contract

**Base URL:** `VITE_API_BASE_URL` (default `/api`)  
**Content type:** `application/json`  
**Dates:** ISO 8601 strings (`2026-10-26T10:00:00+05:30`)  
**IDs:** opaque strings; the UI also treats `permanentId` and `caseNo` as display keys.  
**Auth:** cookie session (`credentials: 'include'`) or an `Authorization: Bearer …` header added in `HttpRepository.request`.

### Error shape

```json
{
  "error": {
    "code": "CASE_NOT_FOUND",
    "message": "Case AICTE/2026/00587 does not exist",
    "details": {}
  }
}
```

Use standard status codes: `400` validation, `401` unauthenticated, `403` forbidden, `404` not found, `409` conflict/stale version, `422` business-rule failure, `500` server error. The current adapter surfaces `status` and `body` through `ApiError`.

### Endpoints used by the frontend

| Method | Path | Response | Notes |
|---|---|---|---|
| `GET` | `/institutions` | `Institution[]` | Full master is acceptable at AICTE scale; add pagination later if needed. |
| `GET` | `/cases` | `CaseRecord[]` | Include timeline and documents for the demo. In production, use a list projection and fetch detail separately. |
| `GET` | `/overlaps` | `Overlap[]` | All statuses; the UI filters pending/confirmed/dismissed. |
| `GET` | `/triage` | `IncomingComplaint[]` | Pending intake queue. |
| `POST` | `/cases/:id/actions` | `CaseRecord` | Append an action and return the updated case. |
| `PATCH` | `/overlaps/:id` | `Overlap` | Body: `{ "status": "confirmed" \| "dismissed" \| "pending" }`. |
| `POST` | `/triage/:id/assign` | `{ "complaintId": "..." }` | Body: `{ "bureau": "...", "officer": "...", "note": "..." }`. Creates a case server-side. |
| `POST` | `/triage/:id/dismiss` | `{ "complaintId": "..." }` | Body: `{ "reason": "..." }`. |
| `POST` | `/demo/reset` | `204` | Development/demo only. Re-seeds fixtures. |

Optional endpoints for the next iteration:

```text
GET  /institutions/:id
GET  /cases/:id
GET  /analytics/dashboard
GET  /analytics/reports?from=&to=
GET  /cases/:id/audit
POST /attachments
```

### Request examples

**Record a case action**

```http
POST /api/cases/case-587/actions
Content-Type: application/json

{
  "text": "Institution reply received. Inspection scheduled for 29 October.",
  "status": "Action initiated",
  "visibility": "Internal",
  "actor": "Vikram Rao"
}
```

The server should:

1. Validate the actor's authority for the case.
2. Append the action to the immutable `actions` table.
3. Update `last_action`, `last_action_at`, `status` and `next_action` on the case.
4. Return the full updated `CaseRecord` (including the new timeline event).
5. Write an audit event in the same transaction.

**Decide an overlap**

```http
PATCH /api/overlaps/ov-1
Content-Type: application/json

{ "status": "confirmed" }
```

If confirmed, create a coordination task/case link server-side. Never auto-merge.

**Assign a complaint**

```http
POST /api/triage/cmp-1/assign
Content-Type: application/json

{
  "bureau": "PGRC",
  "officer": "Ananya Menon",
  "note": "Link to parent case AICTE/2026/00412."
}
```

The server should create the `CaseRecord`, link the raw complaint, start the SLA clock and return `{ "complaintId": "cmp-1" }`.

---

## Mapping to a database

The frontend types map naturally to the entities in `RESEARCH_AND_BLUEPRINT.md`:

- `Institution` → `institutions` + `programmes`
- `CaseRecord` → `cases` + `actions` + `attachments` + `assignments`
- `IncomingComplaint` → `complaints` (raw intake)
- `Overlap` → `case_links` / `dedup_candidates`
- `TimelineEvent` → `actions`

Recommended server-side rules:

- **Case number** generated server-side; never trust the client.
- **Institution identity** resolved server-side or via a dedicated `/institutions/resolve` service; the UI’s `getInstitution` is only a lookup over already-loaded data.
- **Audit** is append-only and written in the same transaction as the mutation.
- **Sealed cases** enforce access control server-side. The frontend masking is a UX affordance, not a security boundary.
- **SLA clocks** computed server-side from configurable rules; the UI only displays them.
- **Idempotency keys** on mutations to prevent duplicate submissions.
- **Optimistic concurrency** (`version` or `updatedAt`) for case edits; return `409` on conflict.

---

## Migration checklist

1. Implement the endpoints above against Postgres (or your preferred DB).
2. Add authentication and role/scope claims to the session.
3. Set `VITE_DATA_MODE=api` and `VITE_API_BASE_URL`.
4. Add CORS with credentials and CSRF protection (or use same-origin deployment).
5. Replace `MockRepository` with `HttpRepository` in production builds.
6. Move dashboard/report fixtures (`src/data/mock.ts` chart arrays) to `/analytics/*` when analytics is ready.
7. Add contract tests against the JSON shapes in `src/data/types.ts`.
8. Load-test the overlap queue and dashboard aggregation queries.

## What is intentionally still local

- `dashboardKpis`, monthly inflow, disposal trend, bureau workload, ageing and region load are presentation fixtures in `src/data/mock.ts`.
- Reports and Settings use local demo fixtures.
- File uploads/downloads are not wired.
- Notifications are in-app/toast only.
- Authentication is a persona switcher, not real auth.

These are presentation-layer fixtures, not hidden data dependencies. The entity read/write path is already behind the repository interface.

---

## Suggested backend shape

A pragmatic production stack:

- **API:** FastAPI (Python) or NestJS/Express (TypeScript)
- **DB:** PostgreSQL 16 + `pgvector` for overlap embeddings
- **Queue:** Redis + Celery/BullMQ for ingestion, alerts, report generation
- **Object storage:** S3-compatible (MinIO on-prem) for documents
- **Auth:** OIDC/SAML with AICTE identity; role + scope claims
- **Search:** Postgres full-text/trigram first; OpenSearch only if needed
- **Deployment:** Docker Compose for the pilot; Kubernetes/NIC cloud for scale

The frontend does not care which one you choose as long as the JSON contract above is respected.
