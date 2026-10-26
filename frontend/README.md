# AICTE Samanvay — Frontend Prototype

**SIH 2026 · Problem Statement SIH26264**
*Integrated Dashboard for Monitoring and Tracking Institution-Related Complaint Cases Across AICTE Bureaus/Cells*

A demo-ready frontend for an institution-centric complaint coordination layer across AICTE bureaus and cells. The core idea: **one institution, one case file** — surface cross-bureau overlaps before they become conflicting actions.

> This is a frontend prototype with synthetic complaint data. It is not connected to AICTE systems.

---

## Run locally

```bash
pnpm install
pnpm dev
```

Open **http://localhost:5173**.

Production build:

```bash
pnpm build
pnpm preview
```

---

## Demo path (5 minutes)

1. **Command Centre** (`/`) — KPI cards, case inflow, SLA health, bureau workload, ageing, regional pressure, overlap spotlight, risk watchlist.
2. **Overlap Queue** (`/overlaps`) — the hero feature. Review a cross-bureau match, expand “Why this was flagged”, confirm a link or merge a duplicate.
3. **Institution 360** (`/institutions/inst-1`) — Siddaganga Institute of Technology: case-family graph, risk composition, compliance context and full complaint history.
4. **Case Workbench** (`/cases/case-587`) — timeline, ownership, SLA, linked cases, audit panel. Click **Record action** to add a timeline event and change status.
5. **Triage Inbox** (`/triage`) — open the Hindi complaint, show translation + AI classification + duplicate candidate, then **Accept & assign** to create a case.
6. **Sealed-case access** — open `/cases/case-603` as the default PGRC Officer. The case is masked. Use the role switcher (top right) → **Cell Officer** to reveal it.
7. **Reports** (`/reports`) and **Configuration** (`/settings`) — performance reporting and configurable SLA/routing/access/source adapters.

Keyboard: **⌘K / Ctrl+K** opens global search.

---

## Demo personas

Switch roles from the avatar menu in the top-right corner:

| Role | Persona | What changes |
|---|---|---|
| PGRC Officer | Ananya Menon | Default; sealed cases masked |
| RB Officer | Vikram Rao | Regulation Bureau view |
| Cell Officer | Meera Krishnan | Sealed inquiry access |
| Senior Management | Dr. R. K. Soni | Portfolio oversight |

Role state is local to the demo; there is no real authentication.

---

## Routes

| Route | Screen |
|---|---|
| `/` | Command Centre |
| `/overlaps` | Overlap Queue |
| `/triage` | Triage Inbox |
| `/cases` | Case Registry |
| `/cases/:id` | Case Workbench |
| `/institutions` | Institution Directory |
| `/institutions/:id` | Institution 360 |
| `/reports` | Reports & Analytics |
| `/settings` | Configuration |

---

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Recharts
- Lucide icons
- React Router
- Fraunces / Manrope / JetBrains Mono (bundled via Fontsource)

---

## Backend-ready architecture

The UI is separated from its data source:

```
Pages / components
       ↓
useData()  (typed context + loading/error states)
       ↓
SamanvayRepository interface
       ↓
MockRepository (demo)  or  HttpRepository (real API)
```

Switch modes with environment variables:

```bash
# Default: local async mock
VITE_DATA_MODE=mock pnpm dev

# Real backend
VITE_DATA_MODE=api \
VITE_API_BASE_URL=http://localhost:4000/api \
pnpm dev
```

The API contract, request/response examples, error format, database mapping and migration checklist are in **[BACKEND.md](./BACKEND.md)**.

The key point: pages no longer import fixture arrays directly. A backend team can implement the documented endpoints and flip one environment variable. The demo mode remains fully functional and mutations persist for the session.

## What is mocked

- **Institution master:** 10 demo institutions shown in the directory; the full system count (12,981) is a display figure based on AICTE’s public approved-institution universe.
- **Complaints/cases:** entirely synthetic, created for the demo.
- **Integrations:** CSS, CPGRAMS, email/IMAP, CSV and Anti-Ragging adapters are represented as UI states; no live connections exist.
- **AI:** triage and overlap outputs are pre-written demo data. No model is called at runtime.
- **Roles/permissions:** local state; sealed-case masking is a UX demonstration, not a security boundary.
- **Export/download actions:** stubbed with toast feedback.
- **Analytics fixtures:** dashboard/report chart arrays are still local in `src/data/mock.ts`; move them to `/analytics/*` when the backend is ready.

---

## Project structure

```
src/
  components/
    layout/        App shell, sidebar, topbar, command palette
    ui/            Buttons, badges, panels, modal, tabs, toast, etc.
    charts/        Recharts wrappers
    cases/         Case table (desktop table + mobile cards)
    institutions/  Case-family graph
    overlaps/      Match score
  pages/           One file per screen
  data/            Types and synthetic demo data
  context/         Role/persona context
  lib/             Presentation tokens, navigation, utilities
```

---

## Notes for the pitch

- The product is a **federation/coordination layer**, not another complaint intake portal. It sits over CSS, CPGRAMS, email, letters and bureau registers.
- The **overlap engine** is explainable: institution identity, semantic similarity, category, entities, recency and cross-bureau signal. It never auto-merges or auto-penalises.
- **Sensitive cases** are sealed and need-to-know. Every view is auditable in the product design.
- **Demo honesty:** real public institution names, synthetic complaints, simulated adapters. Say this clearly to judges.
