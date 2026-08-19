# PMO Pulse

**PMO Pulse** is a portfolio health dashboard built to answer one management question:

> **Which projects need attention, why, and what does that mean for the portfolio as a whole?**

Portfolio status is often spread across separate reports, making exceptions harder to spot and management attention less consistent. PMO Pulse brings health, cost outlook, risks, milestones, and overdue actions into one reporting-date view, all based on a single dataset.

---

## Purpose

PMO Pulse is designed for:

- PMO leaders
- Project directors
- Senior managers
- Portfolio reviewers

The focus is **management triage rather than report browsing**. The dashboard helps users identify where attention is needed, understand the reason, and move directly into project-level detail.

---

## Key Features

### Portfolio Summary KPIs

The dashboard provides summary cards for:

- Active Projects
- On Track
- At Risk
- Critical
- Overdue Actions

Clicking a summary card cross-filters the project portfolio table.

### Management Attention

An exception-only management view highlights projects requiring attention and explains the specific reasons.

Examples include:

- Behind schedule
- Schedule at risk
- Risk exposure
- Cost forecast variance
- Overdue actions
- Open risks

The section uses a two-column layout on desktop.

### Portfolio Cost Outlook

Provides a consolidated financial view of:

- Approved budget
- Forecast cost
- Total variance
- Number of projects forecasting over budget

### Portfolio Health & Progress

Shows:

- Portfolio health distribution
- Project-level progress
- Relative portfolio status at a glance

### Project Portfolio Table

The main portfolio table supports:

- Search
- Phase filtering
- Status filtering
- Clear filters
- Full-portfolio count, for example `Showing 3 of 8`
- Analytical sorting by:
  - Management Priority
  - Project Name
  - Progress
  - Next Milestone
  - Cost Variance

### Project Drill-Down

Selecting a project opens a slide-out detail panel containing:

- Project information
- Semantic status labels
- Progress
- Cost variance
- Schedule status
- Risk status
- Risks linked to the selected project

### Top Risks & Upcoming Milestones

Risk and milestone items are interactive.

Selecting an item opens the relevant project detail directly.

### Responsive & Accessible UI

PMO Pulse includes:

- Responsive layouts
- Keyboard-accessible interactions
- Light and dark themes
- Semantic design tokens
- Status wording designed for management use rather than raw RAG terminology

---

## Data Model

Portfolio sample data is defined in:

```text
src/data/portfolio.ts
```

### `Project`

Each project contains:

```ts
id
name
manager
phase
overallHealth
scheduleHealth
costHealth
riskHealth
progress
approvedBudget
forecastCost
openRisks
overdueActions
nextMilestone
nextMilestoneDate
```

#### Project phases

```text
Planning → Engineering → Procurement → Construction → Commissioning
```

#### Health ratings

The four health fields use:

```text
Green | Amber | Red
```

These raw values are converted into management-friendly wording in the user interface.

### `PortfolioRisk`

Each portfolio risk contains:

```ts
id
projectId
description
severity
owner
```

### `portfolioMeta`

The demo uses a fixed reporting date:

```text
2026-08-17
```

This date acts as the reference "today" for all time-based calculations.

Using a fixed reporting date keeps the demo deterministic, so milestone and overdue logic remains consistent whenever the application is opened.

---

## Derived Metrics

Portfolio calculations are centralized in:

```text
src/lib/portfolio-metrics.ts
```

Figures are calculated from the source arrays rather than stored separately.

Derived logic includes:

- Portfolio summary counts
- Total overdue actions
- Health breakdown counts
- Health distribution percentages
- Cost variance per project
- Cost variance percentage against approved budget
- Total approved portfolio budget
- Total forecast portfolio cost
- Portfolio cost variance
- Number of projects forecasting over budget
- Management Attention reasons
- Prioritized Management Attention list
- Milestone timing status
- Milestone time window
- Management Priority ranking

### Milestone Logic

Milestones are classified relative to the fixed reporting date as:

```text
Overdue
Due Soon
Upcoming
```

### Management Priority Sort

Management Priority ranks projects using:

1. Overall health rank
2. Overdue actions
3. Open risks
4. Cost variance

This keeps projects with stronger exception signals higher in the management review order.

---

## Status Wording

Status wording is centralized in:

```text
src/lib/status-labels.ts
```

The UI translates raw health values into management language such as:

### Overall Health

```text
Green → On Track
Amber → At Risk
Red → Critical
```

### Schedule

Examples include:

```text
On Schedule
Schedule at Risk
Behind Schedule
```

### Risk

Risk health is expressed as risk exposure rather than as a color.

### Cost

Cost wording is derived from forecast cost versus approved budget.

Centralizing status wording keeps terminology consistent across the dashboard and prevents raw RAG labels from appearing unnecessarily in management-facing views.

---

## Main Interactions

```text
Summary card click
    ↓
Cross-filter portfolio table

Column sort
    ↓
Reorder projects using the selected analytical sort

Search + phase/status filters
    ↓
Narrow the visible portfolio

Project row / risk / milestone click
    ↓
Open project detail sheet

Keyboard Enter
    ↓
Open selected project detail

Clear filters
    ↓
Reset table-level filters
```

---

## Architecture

PMO Pulse is a client-side application built with:

- **TanStack Start v1**
- **React 19**
- **Vite 7**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui**

### Project Structure

```text
src/
├── components/
│   └── pmo/
│       └── Presentational PMO dashboard components
├── data/
│   └── portfolio.ts
├── lib/
│   ├── portfolio-metrics.ts
│   └── status-labels.ts
└── routes/
    └── index.tsx
```

The application currently uses a single route:

```text
src/routes/index.tsx
```

The route composes presentational components from `src/components/pmo/`, while portfolio data and calculation logic remain separated in `src/data/` and `src/lib/`.

---

## Current Scope

PMO Pulse is currently:

- Client-side only
- Read-only
- Based on fictional sample data
- Designed around one portfolio
- Based on one fixed reporting date

It does **not** currently include:

- Backend services
- Database persistence
- Authentication
- Editing
- Data import
- Export
- Historical reporting
- Trend analysis
- Forecasting models
- AI features

---

## Limitations

- All projects, people, risks, milestones, and financial figures are fictional sample data.
- Data cannot currently be edited or saved.
- The dashboard represents a single portfolio and reporting date.
- Historical trends are not available.
- Health ratings are authored directly in the sample dataset.
- Cost wording is calculated from forecast cost versus approved budget, so an authored cost health rating can differ from the calculated cost message.
- Summary-card filter state and table filter state are separate.
- Using **Clear filters** resets table filters but does not currently reset an active summary-card filter.

---

## Project Goal

PMO Pulse is a learning and prototyping project focused on a practical PMO use case: turning portfolio data into a concise management view that makes exceptions easier to identify and investigate.

The current version focuses on the reporting and interaction model first. Future versions can add persistence, live data sources, history, trends, workflow, and decision-support features.
