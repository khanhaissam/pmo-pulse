# PMO Pulse

Build a professional responsive web application called PMO Pulse.

PMO Pulse is a project portfolio health dashboard designed for PMO leaders, project directors, and senior managers who need to quickly understand which projects are on track and which require management attention.

This is V1. Keep the scope focused on a single portfolio dashboard using fictional local sample data.

Main objective

The dashboard should answer:

Which projects need management attention right now, and why?

Header

Show:

PMO Pulse

Subtitle:

Portfolio health at a glance

Use a clean professional business application style.

Portfolio summary

Create five summary cards:

Active Projects

On Track

At Risk

Critical

Overdue Actions

These values must be calculated from the underlying project sample data rather than entered separately.

Fictional project data

Create 8 fictional projects.

Use neutral project names such as:

Project Atlas

Project Orion

Project Nova

Project Zenith

Project Horizon

Project Falcon

Project Aurora

Project Summit

For every project include:

Project name

Project manager

Project phase

Overall health

Schedule health

Cost health

Risk health

Progress percentage

Approved budget

Forecast cost

Number of open risks

Number of overdue actions

Next milestone

Next milestone date

Project phases can include:

Planning

Engineering

Procurement

Construction

Commissioning

Health values should use:

Green

Amber

Red

Create realistic fictional data with a mix of healthy and troubled projects.

Portfolio health section

Create a clear visual showing the number or proportion of Green, Amber, and Red projects.

Keep it easy for management to understand.

Project portfolio table

Create a table containing:

Project

Phase

Overall

Schedule

Cost

Risk

Progress

Next Milestone

Use clear Green, Amber, and Red status indicators.

Allow the user to search for a project.

Add filters for:

Project phase

Overall health

Do not add editing yet.

Progress visualization

Create a simple visualization comparing progress percentage across the 8 projects.

Avoid unnecessary decorative charts.

Top risks

Create a section showing several important fictional portfolio risks.

Each risk should show:

Project

Risk description

Severity

Owner

Use realistic examples such as:

equipment delivery delay

contractor resource shortage

design approval delay

commissioning readiness

cost forecast increase

Upcoming milestones

Show important milestones occurring within the next 30 days.

Display:

Project

Milestone

Date

Status

Design direction

This should look like a modern internal PMO or enterprise management application.

Use:

clear information hierarchy

compact professional layout

good spacing

readable typography

restrained use of colour

responsive desktop and mobile design

Use Green, Amber, and Red mainly for project health status.

Avoid:

excessive gradients

large decorative graphics

unnecessary animations

gaming-style interfaces

excessive use of colour

Technical scope

For this version:

use fictional local sample data

do not add authentication

do not add a database

do not add a backend

do not add AI

do not add external APIs

do not add project editing

do not create unnecessary extra pages

Keep the code structure clean so the application can be expanded later.

Make the KPI cards and visualizations derive their values from the same underlying project data so that the dashboard stays internally consistent.

After building V1, briefly explain:

what you created

how the dashboard data is structured

which values are calculated from the project data

what I should manually test first

Do not make additional changes after the first build.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pmo-pulse.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/80c5d2b9-577f-426b-b6e3-238978792f2d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
