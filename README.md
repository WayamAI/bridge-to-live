# Drishti by Wayam AI

Drishti is a real-time plant operations dashboard built for industrial
sites (the demo data models an LNG plant). It brings equipment health,
predictive maintenance, energy intelligence, alarm management, OT
security, and digital-twin data quality into a single console, aimed at
plant directors, reliability/operations engineers, maintenance managers,
energy managers, and security analysts.

**Live demo:** https://bridge-to-live.vercel.app

## What's in the dashboard

- **Overview** — a rollup dashboard: plant health trend, alarm frequency,
  equipment health heat map, and top active alerts.
- **Equipment Health** — plant-wide equipment overview, per-asset detail,
  failure analysis, and remaining-useful-life forecasts.
- **Maintenance** — predictive maintenance recommendations, work order
  tracking, and maintenance cost tracking.
- **Energy Intelligence** — consumption, load optimisation, and
  sustainability metrics.
- **Alarm Management** — active alarms, alarm analytics, and alarm
  rationalisation tooling.
- **OT Security** — asset registry, threat monitor, network
  segmentation, and compliance dashboard.
- **Digital Twin / Data Quality** — twin sync status, data completeness,
  ISO validation, and a what-if simulator.
- **Handover Tracker & Settings** — shift handover state and app
  settings.

Each area lives under its own route and is reachable from the
role-aware sidebar; the top bar exposes a live clock, tag count, and a
role switcher (Plant Director, Operations Engineer, Reliability
Engineer, Maintenance Manager, Energy Manager, IT/OT Security Analyst,
Handover Manager) that changes what the nav emphasizes.

## Auth (demo mode)

This build ships with a lightweight, **client-only** demo login — there
is no backend or real user database. Any non-empty email and password
signs you in:

- Unauthenticated visits to any dashboard route redirect to `/login`.
- Login state is kept in `sessionStorage`, so it resets on every new
  browser session (closing the tab/window) but survives page refreshes.
- The role dropdown in the top bar (top-right) has a **Log out** option
  that clears the session and returns to `/login`.

See `src/hooks/useAuth.tsx` for the implementation — swap this for a
real auth provider before shipping to real users.

## Theming

The app supports light and dark mode via a `dark` class on `<html>`,
toggled from the sun/moon icon in the top bar. It defaults to **light**
mode on first visit and remembers your choice in `localStorage`
afterwards (`src/hooks/useTheme.tsx`). Brand color tokens (primary,
accent, focus ring) are tuned to Wayam AI orange; functional status
colors (critical/operational/engineering) are left alone for
readability.

## Tech stack

- **React 18 + TypeScript**, bundled with **Vite**
- **React Router** for client-side routing
- **Tailwind CSS** + **shadcn/ui** (Radix primitives) for the component
  library
- **Recharts** for charts, **TanStack Query** for data fetching
  plumbing, **React Hook Form + Zod** for forms/validation
- **Vitest** + **Testing Library** for unit tests, **Playwright** for
  e2e

Data in this build is mocked/generated client-side (see
`src/hooks/usePlantData.ts` and `src/hooks/useFactoryData.ts`) — there
is no live plant integration.

## Project structure

```
src/
  assets/logos/       Wayam AI logo + favicon SVGs
  components/
    layout/            AppLayout, Sidebar, TopBar
    ui/                 shadcn/ui component library
    Logo.tsx            Theme-aware logo (swaps light/dark asset)
  hooks/
    useAuth.tsx          Demo session auth
    useTheme.tsx         Light/dark theme state
    usePlantData.ts      Mock plant/equipment/alert data
  pages/                One file per dashboard route, plus Login.tsx
  App.tsx               Route table + auth guard
  main.tsx               Providers (Theme, Auth) + app mount
  index.css              Design tokens (light + dark) and Tailwind layers
```

## Getting started

Requires Node.js 18+.

```sh
npm install
npm run dev       # start the dev server (http://127.0.0.1:5173)
```

Other scripts:

```sh
npm run build      # production build to dist/
npm run preview    # preview the production build locally
npm run lint        # ESLint
npm run test         # Vitest unit tests
npm run test:watch  # Vitest in watch mode
```

## Deployment

The app is a static Vite build with no server-side requirements, so it
deploys cleanly to Vercel (or any static host):

```sh
vercel --prod
```

The production project (`arka-s-team/bridge-to-live` on Vercel) is Git
connected to the [`WayamAI/bridge-to-live`](https://github.com/WayamAI/bridge-to-live)
repository — pushes to `main` there trigger a new production deploy
automatically.
