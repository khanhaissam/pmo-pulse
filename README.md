No code changed. Here's the handoff summary, ready to paste into your README.

---

PMO Pulse

A portfolio health dashboard that answers one question: which projects need management attention, why, and what does that mean for the portfolio as a whole?

Problem
Portfolio status is usually spread across separate reports, so exceptions surface late and inconsistently. PMO Pulse condenses a delivery portfolio into a single reporting-date view where health, cost outlook, risks and milestones are all derived from one dataset.

Target users
PMO leaders, project directors and senior managers who review portfolio status periodically and need to triage rather than browse.

Key features
- Summary KPIs — active projects, on track, at risk, critical, overdue actions; clicking a card cross-filters the portfolio table.
- Management Attention — exception-only cards (2-column on desktop) listing each project's specific reasons for attention.
- Portfolio Cost Outlook — approved budget vs forecast, total variance, and how many projects forecast over budget.
- Portfolio Health & Progress — status distribution and per-project progress.
- Project Portfolio table — search, phase/status filters, analytical sorting (Management Priority, Name, Progress, Milestone, Cost Variance), full-portfolio count ("Showing 3 of 8"), Clear filters.
- Project drill-down — slide-out detail with semantic status labels, cost variance and the risks linked to that project.
- Top Risks & Upcoming Milestones — both open the relevant project detail.
- Responsive, keyboard-accessible, light/dark theming via semantic design tokens.

Data model (`src/data/portfolio.ts`)
- `Project` — `id`, `name`, `manager`, `phase` (Planning → Commissioning), four health ratings (`overallHealth`, `scheduleHealth`, `costHealth`, `riskHealth` as Green/Amber/Red), `progress`, `approvedBudget`, `forecastCost`, `openRisks`, `overdueActions`, `nextMilestone`, `nextMilestoneDate` (ISO).
- `PortfolioRisk` — `id`, `projectId`, `description`, `severity`, `owner`.
- `portfolioMeta` — fixed reporting date (2026-08-17) used as the reference "today" for all time-based logic, so the demo is deterministic.

Derived metrics (`src/lib/portfolio-metrics.ts`)
Nothing is stored twice — every figure is computed from the arrays above:
- Portfolio summary counts and total overdue actions.
- Health breakdown counts and percentages.
- Cost variance per project (absolute + % of approved budget) and portfolio cost outlook (totals, variance, over-budget count).
- Management Attention reasons and the prioritised attention list.
- Milestone status and window relative to the reporting date (overdue / due soon / upcoming).
- Management Priority sort: health rank first, then severity signals (overdue actions, open risks, cost variance).

Status wording is centralised in `src/lib/status-labels.ts` (On Track / At Risk / Critical, On Schedule / Behind Schedule, risk exposure levels, and cost phrasing derived from forecast vs approved budget) so no RAG jargon leaks into the UI.

Main interactions
Card click → filters table · column sort → reorders by analytical priority · search + phase/status filters → narrow the list · row / risk / milestone click (or Enter) → project detail sheet · Clear filters → resets table filters.

Architecture
TanStack Start v1 (React 19, Vite 7), TypeScript, Tailwind CSS v4 with semantic tokens, shadcn/ui primitives. Single route (`src/routes/index.tsx`) composing presentational components in `src/components/pmo/`, data in `src/data/`, derivations in `src/lib/`. Client-side only — no backend, database, auth or AI.

Limitations
- All data is fictional sample data; no real projects, people or financials.
- Read-only: no editing, persistence, export or user accounts.
- Single portfolio, single reporting date (no history, trends or forecasting).
- Health ratings are authored in the dataset; only cost wording is derived, so a rating and its derived cost text can differ.
- Filter state is split between the summary cards and the table, so "Clear filters" does not reset an active card filter.
