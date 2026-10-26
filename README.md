# SIH 2026 · AICTE Samanvay

Two deliverables for the SIH 2026 problem statement **SIH26264** — *Integrated Dashboard for Monitoring and Tracking Institution-Related Complaint Cases Across AICTE Bureaus/Cells*.

## 1. Research & blueprint
[`RESEARCH_AND_BLUEPRINT.md`](./RESEARCH_AND_BLUEPRINT.md)

Domain research, AICTE org/channel context, product strategy, overlap-detection design, data model, architecture, hackathon execution plan and feasibility assessment.

## 2. Frontend prototype
[`frontend/`](./frontend)

A working React + TypeScript demo with:
- Command Centre dashboard
- Institution 360 and case-family graph
- Unified case workbench with timeline/SLA/audit
- Overlap Queue with explainable match scores
- Triage Inbox with translation + AI recommendations
- Reports and configuration screens
- Role switching and sealed-case masking
- Responsive desktop/mobile layouts

Run it:

```bash
cd frontend
pnpm install
pnpm dev
```

Then open http://localhost:5173.

The prototype uses synthetic complaints and a small demo institution set. It does not connect to live AICTE systems.

### Backend handoff

The frontend is backend-ready: pages consume a typed `SamanvayRepository` through `useData()`. Switch from the async mock adapter to a real API with:

```bash
VITE_DATA_MODE=api
VITE_API_BASE_URL=http://localhost:4000/api
```

See [`frontend/BACKEND.md`](./frontend/BACKEND.md) for the endpoint contract, request/response examples, database mapping and migration checklist.
