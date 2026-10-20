# REVIEW_FIXES.md

Audit of reviewer feedback a–h on PlantMind (`bridge-to-live`). Branch `review-fixes`, from `origin/main` at `bc9856a`. **Audit only: no source files were changed.**

How this was checked: production build (`vite preview`, port 4180) and `npm run dev` (port 5180), Playwright/Chromium, 28 routes × light/dark × 1440/390 = 112 combos each. The login and sidebar tests used a fresh browser context (a clean profile).

## Baseline (before any change)

| Check | Result |
|---|---|
| `tsc -p tsconfig.app.json --noEmit` | Pass |
| `npm test` | Pass, 49 tests (incl. `icons.test.ts`, 6) |
| `npm run build` | Pass (one 1.1 MB chunk warning, T13) |
| `npm run lint` | **Fail**: 15 problems (6 errors, 9 warnings), all the known T11 items |
| Sweep, production build | 112 combos: every route has one h1, no overflow, no blank charts, no console output. Only the intended 404 route `/nope` logs a `console.error`. |
| Sweep, `npm run dev` | 112 combos: 0 structural failures. Console warnings below. |
| Page marks | 26 of 26 route marks load (`naturalWidth > 0`); no broken image. `icons.test.ts` also asserts a mark for every route. |

### Console warnings per route (dev build, all 112 combos)

| Route | Warning |
|---|---|
| `/predictive-maintenance` | React: "Each child in a list should have a unique `key` prop" (T8) |
| every route, including `/login` and `/nope` | React Router v6 future-flag warnings: `v7_startTransition` and `v7_relativeSplatPath` (two lines per route) |
| `/nope` | intentional `console.error` "404 Error: User attempted to access non-existent route" |

No act/ref/prop-type warnings anywhere.

---

## a. Icons are missing

**What is wrong today**
- Route icons are complete (sidebar and page headers; page marks load). Everywhere else icons are close to absent. Counted in the DOM at 1440 across the 26 app routes:
  - **KPI tiles: 0 of 83 tiles have an icon** (`KpiTile`, `components/ui/primitives.tsx:76`). The Energy "icons" are sparklines, not icons.
  - **Panel headers: 5 of 59** have an icon (`Panel`, `primitives.tsx:35`; only Dashboard (the "View all" chevron), Handover, Simulator, Data Sources and Settings).
  - **Buttons with text and no icon:** Alarms 10 (the filter pill and per-row actions partly), Failure Analysis 6, Predictive Maintenance 8, Work Orders 5, OT Assets 4, ISO Validator 4 (many are filter chips, which are fine without icons; the action buttons are not).
  - **Empty states:** `EmptyState` (`primitives.tsx:159`) has no icon (Dashboard "Select equipment…", "No maintenance in the next 60 days", Failure Event Timeline).
  - **Table actions:** Acknowledge has an icon; sort headers have one; row "expand" in Predictive Maintenance has a chevron; Work Orders, ISO Validator and What-If "Save scenario" have none.
- Sidebar and page icons are all lucide and greyscale already.

**Proposed fix** (greyscale lucide, stroke 1.75 via `index.css`, all through `src/lib/icons.ts`)
1. `KpiTile` gets an optional `icon` prop, rendered 16px `text-icon-quaternary` beside the eyebrow label. Add a `kpiIcon` map in `icons.ts` (one icon per metric meaning, e.g. health `HeartPulse`, alarms `Bell` (reuse `icons.alarms`), energy `Zap`, cost `Wallet`, downtime `Timer`, handover `ArrowRightLeft`). Keep one-icon-one-meaning; extend the uniqueness test.
2. `Panel` gets an optional `icon` prop for the eyebrow header (charts, tables, lists); same map style.
3. `EmptyState` gets an icon slot (default `Inbox`/`SearchX`, size 20, `text-icon-quaternary`).
4. Action buttons (Save scenario, Create work order, Validate, Export-type buttons) get a 13px leading icon (`iconSize.pill`).
5. Tabs: Settings already has them; add icons to the other tabbed view(s) where present.

Files: `lib/icons.ts`, `components/ui/primitives.tsx`, ~20 pages (props only), `test/icons.test.ts`, `test/primitives.test.tsx`.
Risk: **L–M** (many files, mechanical; no data/behaviour change). Logic change: **no**.

---

## b. OEE indicator is black

**What is wrong today** (screenshots light and dark, `/`, bottom panel)
- `components/twin/OEEDashboard.tsx:39`: the fourth item is not a gauge. It is a static `<div className="… rounded-full border-4 border-foreground">`. `border-foreground` is the primary text colour, so the ring is **black in light and white in dark**. It also has no progress arc (always a full ring) and its label "OEE" uses `text-foreground` while the other three use `text-quaternary`.
- The other three use `OEEGauge` with `seriesColor(0)` = `var(--analytics-series-1)` (blue, `chartTheme.ts:5`). The black ring is the only element on the Dashboard that does not use a series or status colour.
- Not a token bug and not `action-primary`: it is a hard-coded class on the one element that bypasses `OEEGauge`.

**Proposed fix:** render the overall value with the same `OEEGauge` (same ring, `seriesColor(0)`, animated arc at `oee.overall`). Distinguish it by a heavier label (`type-label-sm text-foreground`) only, not by colour. Both themes use the same CSS variable, so light and dark match.
Files: `components/twin/OEEDashboard.tsx`. Risk: **L**. Logic change: **no** (the ring now shows the real 79.2% arc instead of a full ring; presentation only).

---

## c / f. UI consistency, alignment, presentation

Measured across the 26 app routes (1440 light) plus 390, and by eye on every page screenshot.

What is already consistent: page header position (h2 at the same x,y on every route), page marks, one h1 per route, sidebar icons, hairline borders, no horizontal overflow.

| # | Inconsistency | Where (evidence) | Fix |
|---|---|---|---|
| C1 | KPI grid columns differ per page: 5 (Dashboard), 6 tiles in a 3×2 grid (Failure Analysis, Energy, Predictive Maintenance), 4 elsewhere; tile heights then differ page to page | `/`, `/failure-analysis`, `/energy` | Standard KPI row: 4 columns at `lg`, 2 at `sm`; 6 tiles become 3+3 only when 6, else 4/5. Document in `PageHeader`/`KpiTile` |
| C2 | Chart heights vary without a rule: 180, 200, 220, 240, 260, 280, 320 px | Dashboard 180, Failure 220/280/200, RUL 260/280, Maint. cost 280/200/200, Sustainability 280/180/200 | Two heights only: 220 (standard) and 280 (hero). Put in `chartTheme.ts` |
| C3 | Panels in one row with very different content heights leave large empty areas | Dashboard right column (empty "Select equipment" panel beside a full list), Failure Analysis right column, Simulator right column | Equal-height rows (`items-stretch` + panel body fill); compact empty state |
| C4 | Native checkbox ("Show acknowledged") and native sliders/toggle in the Simulator look unlike the rest (black thumbs, no track fill) | `/alarms` toolbar, `/simulator` | Use the existing `Chip`/switch styles; style slider with tokens |
| C5 | Sidebar labels differ from page titles on 14 of 26 pages ("Cost Tracker" vs "Maintenance Cost Tracker", "Configuration" vs "Settings & Configuration", "Connected Systems" vs "Handover Tracker" page) | `nav.ts` | Align title and label (labels in `nav.ts`; **routes unchanged**) |
| C6 | Date formats mix ISO `2026-07-22` (charts), `Oct '25`, `Jan`, and `Mar '26` | Dashboard, Sustainability | One short format ("22 Jul") via `lib/format.ts` for chart axes |
| C7 | Number/currency formats differ: `₹4200L` (no separator) next to `₹976L`, `₹8.74 Cr`, `₹42L/yr`; `0k T CO₂e`; `Nm³/hr` | `/simulator`, `/failure-analysis`, `/energy` | Route all through `lib/format.ts` (thousand separators; no `0k`) |
| C8 | Casing: tags `ACK` (all caps) vs "Acknowledge"; abbreviations "Total Maint. Cost", "Avg MTBF (Fleet)"; "Rate Of_change" (T4) | `/alarms`, `/failure-analysis` | Sentence case for labels, one wording rule; T4 |
| C9 | KPI value colours mix neutral/orange/red/green with no rule visible to the viewer (Dashboard: 89.6% orange, 4 red, 0 black, 73% orange) | `/` | Keep (colour = status per Chronus), but add status dot/delta so the reason is visible; decision D6 |
| C10 | Equipment detail panel is clipped at the bottom while the registry beside it is 600px; third sensor card cut off | `/equipment` after row click | Let the detail panel scroll internally with the same max height as the registry |
| C11 | Tables clip their last column in half-width panels ("VIBRATIC", "TRE") | Dashboard heat map, Failure Analysis Pareto table | Shorter headers / `overflow-x` affordance / fixed column widths |
| C12 | Sensor sparkline is almost flat (scale = full sensor range) and dashed lines look like an empty chart | EquipmentDetail "Live sensors" | Scale to the normal band ± margin |
| C13 | Primary/secondary/pill button styles: three variants in use (black pill, outlined pill, text link with chevron); heights 32/36/44 | Dashboard actions, Settings "Save changes", Login | Define `Button` variants in `primitives.tsx` (primary, secondary, ghost) and use them |

Files: `primitives.tsx`, `chartTheme.ts`, `format.ts`, `nav.ts`, ~15 pages. Risk: **M** (broad, visual). Logic change: **no** except C6/C7 (formatting only).

---

## d. Login flow before the dashboard

Fresh browser profile, production build. **No route is reachable without logging in**: a guard already exists (`App.tsx:40-49`, `RequireAuth`).

| Step | Result |
|---|---|
| Open `/` directly (no session) | Redirected to `/login` (router state `from: "/"`) |
| Open `/alarms` directly | `/login`, `from: "/alarms"` |
| Open `/equipment/detail` directly | `/login`, `from: "/equipment/detail"` |
| Empty submit | "Enter any email and password to continue." |
| Log in (from `/alarms`) | Returns to `/alarms` |
| Refresh | Stays on `/alarms` (session is in `sessionStorage`) |
| Open a **new tab**, same profile, `/` | **`/login`**: the session is per-tab (`sessionStorage`, `hooks/useAuth.tsx:15,24`) |
| Open `/login` while logged in | **Stays on `/login`** and shows the sign-in form (no redirect) |
| Log out (role menu → Log out) | `/login`, `sessionStorage` cleared |
| Browser Back after logout | Stays on `/login` (history was replaced; no protected content shown) |
| Forward after Back | `/login` |

So the guard works. The gaps are small:
- **d1.** `/login` while authenticated shows the form instead of redirecting (repro above). Fix: `Login` (or a `RedirectIfAuth` wrapper) returns `<Navigate to="/" replace />` when `isAuthenticated`. `Login.tsx`/`App.tsx`. Risk **L**. Logic change: **yes**, small.
- **d2.** Logout lives inside the role menu (`TopBar.tsx:107-115`), not visible as an account control, and the signed-in email is stored (`wayam-auth-email`) but never shown. Fix (presentation): show the email in the menu header and give the Log out item the `signOut` icon (already in `icons.ts`). Risk **L**, logic **no**.
- **d3 (decision).** Session is per-tab. A new tab asks you to log in again. Keep (safer for a demo; the code comment says it was made session-scoped on purpose) or switch to `localStorage`? Not changing without your call.
- Not changing: demo-login behaviour (any email/password), `from` redirect after login.

---

## e. Functional issues, especially the tree view

**Tree view:** there is **no tree component in the app**. I searched for tree/expand/collapse/`aria-expanded`/`role="tree"` across `src`. What exists:
- Sidebar (`Sidebar.tsx`): ten always-open groups, no collapse/expand of groups. The only expand/collapse control is the width toggle.
- `/predictive-maintenance`: expandable table rows (`PredictiveMaintenance.tsx:42,96`).
- `/network`: the Purdue levels list is a static hierarchy (no interaction).
- `/ot-assets`: a flat table. `components/PhaseTracker.tsx` is unused (not routed).

Because of this I can't repro a "tree view bug" from the app as it stands. This needs your decision (D1): the reviewer most likely means the **sidebar navigation** (a flat list of 10 groups / 26 items that scrolls), which is covered by item g. If they mean a real hierarchy (e.g. plant → unit → equipment), that is a **new feature** and I will not build it unasked.

**Interaction tests on what does exist** (browser, desktop 1440 and mobile 390):

| Test | Result |
|---|---|
| Active item on `/equipment` and `/equipment/detail` | One active item each (correct) |
| Sidebar nav scroll position after clicking a lower item | Kept (722 → 722) |
| Collapse/expand | 252 ↔ 68 px; label flyout shows on hover/focus |
| Collapse state after reload | **Resets to expanded** (not persisted; `AppLayout.tsx:16`) |
| Tab order | Logo → Dashboard → Plant Overview … correct |
| Alarm badge vs list | 6 and 6 (consistent) |
| Mobile drawer opens | Yes |
| Mobile drawer **Escape key** | **Does not close** (only the scrim click or navigation does) |
| Equipment row click | Selects; detail panel shows; selection kept when switching Overview ↔ Detail inside the SPA; resets on full page load |
| Equipment rows, sortable headers: keyboard | **Not focusable** (`tr[tabindex]` 0, `th[tabindex]` 0) (T7) |
| Predictive Maintenance row | Clickable but not focusable; expands on click |
| Dashboard heat map row click | Fills the detail panel (works) |

**Functional bugs found (new)**
- F1. Dashboard "Predicted Failures (30d)" shows **0** while its hint says "12 components flagged" (static text), and the Simulator baseline says 12 predicted failures (90d). The count uses dates that are already past (`Dashboard.tsx:31`, T9).
- F2. Dashboard "Upcoming Maintenance · next 60 days" is **empty (0 events)** for the same reason (mock dates are in the past, T9).
- F3. Drawer does not close on Escape (above). Fix: key handler in `AppLayout.tsx`; also move focus into the drawer. Risk L.
- F4. `/login` does not redirect when logged in (d1).
- F5. Sidebar collapse not remembered (low; fix = persist in `localStorage`, try/catch).
- F6. Equipment detail panel clipped (C10) and shows negative "days" (T9).
- F7. Sensor sparkline almost flat (C12).

**Tickets T1–T15 (from `REDESIGN_REPORT.md`) triage: which count as "functional" for this round**

| Ticket | Issue | Fix now? | Notes |
|---|---|---|---|
| T1 | `Math.random()` chart data changes on reload | **Yes (High)** | Seeded generator in `lib/`; 15 sites listed by grep: AlarmFrequencyChart, PlantHealthTrend, EquipmentHeatMap, AlarmAnalytics, FailureAnalysis, LoadOptimisation, RemainingUsefulLife (also `PredictiveMaintenance.tsx:51` builds a work-order id; keep). Sensor jitter in `usePlantData` is intentional. Test: values identical across reloads. |
| T2 | Dashboard handover 73% vs Handover page 83% | **Yes (High)** | Compute both from the same data. Also drop static "Ratnagiri LNG Phase 2" / "42,400 tags" only if data exists (decision D4). |
| T3 | Charts not drawing what legend/caption says | **Yes (High)** | Failure Weibull line, Failure event scatter (empty panel, confirmed), Sustainability target line (none visible), RUL fleet-age line, Plant Health legend "Forecast"/"PM events" not drawn, RUL caption "dashed line". Use `ComposedChart`; remove legend entries for series that are not drawn. |
| T4 | "Rate Of_change" | **Yes (High)** | `replace(/_/g, " ")` at `AlarmManagement.tsx:117`. |
| T5 | Settings inputs reset on tab change | **Yes** | Lift state; "Save changes" still only toasts (no backend) |
| T6 | Toasts ignore app theme | **Yes (L)** | `ui/sonner.tsx` reads `hooks/useTheme` |
| T7 | Keyboard access for rows/headers/bars | **Yes** | Buttons or `tabIndex`+Enter/Space; no visual change |
| T8 | Duplicate-key warning | **Yes (L)** | `<Fragment key>` |
| T9 | Mock dates in the past | **Yes** | Generate relative to today (fixes F1, F2, F6, "8 overdue") |
| T10 | `text-quaternary` ≈ 3.4:1 | Decision D5 | Chronus token; changing it changes the design system |
| T11 | 6 lint errors, 9 warnings | **Yes (L)** | Makes `npm run lint` pass; warnings are react-refresh (shadcn files), leave |
| T12 | Weak types/tests | Partly | Add smoke tests for each fix; no strictness change |
| T13 | 1.1 MB chunk | No | Perf, not asked |
| T14 | Horizontal bars cramped at 390 | **Yes (L)** | Part of g (chart polish) |
| T15 | Duplicate routes, undefined `animate-pulse-subtle`, TopBar clock re-render, playwright config, README | Partly | Remove the dead class; the rest not now. Duplicate routes: decision D3 |

---

## g. Dashboard graphs and sidebar

**Dashboard graphs: what looks unprofessional** (1440 light/dark, 390)
- **G1. Plant Health Trend** (`PlantHealthTrend.tsx`): y-axis ticks 75/82/89/100 (domain `[75,100]` gives uneven ticks; the 90 target line sits between ticks); legend lists "Forecast" and "PM Events" which are not drawn (T3); the target label is cut to "Target"; x labels are ISO dates (C6); the line is thin 1.5px with a lot of empty plot area; random data (T1).
- **G2. Alarm Frequency**: 30 stacked daily bars at 180px height are dense; y-axis changes each load (random); last x label clipped at 390 ("2026-10-20" cut); legend OK. Suggest 7 or 14 days, or a thinner bar with fewer ticks.
- **G3. Row/heights**: both charts 180px inside panels that are ~285px tall; unused space under the plot. Panels in the next row are unequal (C3).
- **G4. Heat map**: table wider than panel (last column clipped, "VIBRATIC").
- **G5. Top Active Alerts / detail panel**: the third column is an empty panel until a row is selected (large empty area).
- **G6. OEE panel** sits alone at the bottom with an empty strip below it (b).
- **G7. Upcoming Maintenance**: empty (F2).
- **Other pages' charts:** Failure Weibull is a pale band with 11 cramped x ticks ("24500" clipped); Failure timeline empty; Sustainability bar charts have no legend for the two series; RUL "Fleet Age" legend missing; Energy KPI sparklines have gaps.

**Proposed chart fixes** (no new dependency, Recharts only)
1. One chart height rule (220 standard, 280 hero) and shared axis helpers in `chartTheme.ts`: 4–5 y ticks with `tickCount`, short date formatter, `minTickGap`, right margin for the last label.
2. Dashboard: Plant Health drawn from seeded data with the 90 target line labelled ("Target 90%") and a legend that matches what is drawn; Alarm Frequency 14 days; both 220px; heat map columns sized to fit.
3. Add legends where two or more series are drawn without one (Sustainability, RUL).
4. Fix T3 charts (above).

Risk: **M**. Logic change: **yes**, only to the chart data sources (T1/T3).

**Sidebar: today**
- 10 groups, 26 links, one 36px circular "puck" per item with a grey disc behind every icon, ~1,300 px of nav at 1440×900 (scrolls; the footer has "Collapse sidebar").
- 5 groups contain 1–3 items; "Overview", "Simulator" and "Settings" are single-item groups, each with its own eyebrow and divider.
- Labels differ from page titles (C5); "Plant Overview" (`/equipment`) and "Equipment Detail" (`/equipment/detail`) render the same page (T15).
- The disc behind every icon plus the eyebrow plus dividers makes the list read as heavy, not scannable.

**Proposed structure** (route paths and order of routes unchanged; only `nav.ts` grouping, labels and the sidebar's look)

| Group | Items |
|---|---|
| (no heading) | Dashboard |
| Asset Health | Plant Overview, Equipment Detail, Failure Analysis, Remaining Useful Life |
| Maintenance | Predictive Maintenance, Work Orders, Cost Tracker, What-If Simulator |
| Energy | Consumption, Load Optimisation, Sustainability |
| Alarms | Active Alarms (badge), Alarm Analytics, Rationalisation |
| OT Security | Asset Registry, Threat Monitor, Network Segmentation, Compliance |
| Handover & Data | Handover Tracker, Engineering Twin Sync, Data Completeness, ISO Validator, Connected Systems, Data Quality |
| Footer (pinned) | Settings, Collapse sidebar |

That is **7 headed groups + Dashboard + a pinned footer** (from 10), no single-item groups. Visual: drop the grey discs, keep the 17px icon with a pill highlight on the active row (still greyscale, `bg-raised` active, black pill not needed), 36px rows, 240px width, group eyebrows kept. Optional (decision D1): collapsible groups with the open set remembered, which would also answer "tree view".
Files: `nav.ts`, `Sidebar.tsx`, `AppLayout.tsx` (Esc, persist), `test/icons.test.ts` (nav order assertions if any). Risk: **M**. Logic change: **no** for the restyle and regrouping; **yes** (small) for Esc and persisted collapse.

---

## h. Verify on the running application

Every fix gets, in its own commit message or note: repro before (route, steps, observed), result after on the production preview **and** `npm run dev`, light/dark, 1440/390. The 112-combo sweep script and the auth/sidebar scripts used in this audit are reusable and will be rerun after each commit that touches UI. Gates per commit: `tsc -p tsconfig.app.json`, `npm test`, `npm run build`, `npm run lint` (must be at or below baseline; it should reach 0 errors after T11).

---

## Ordered plan (one commit per fix)

1. `fix: OEE overall gauge uses the series colour` (b)
2. `fix: alarm type label replaces every underscore` (T4)
3. `fix: stable chart data` (T1: seeded generator + tests)
4. `fix: dashboard handover and predicted failures from data` (T2, F1; mock dates relative to today for T9, F2, F6)
5. `fix: charts draw what their legends say` (T3)
6. `ui: dashboard and chart polish` (G1–G7, C2, C6, C11, T14)
7. `ui: icons for KPI tiles, panel headers, empty states and actions` (a)
8. `ui: sidebar structure and style` (g; C5)
9. `fix: redirect /login when signed in; show account in menu` (d1, d2)
10. `fix: keyboard access for rows, headers and the drawer` (T7, F3, F5)
11. `fix: settings keep values across tabs; toasts follow the app theme; duplicate key` (T5, T6, T8)
12. `ui: consistency pass` (C1, C3, C4, C7, C8, C10, C12, C13)
13. `chore: lint errors to zero` (T11; removes undefined `animate-pulse-subtle`)
14. `docs: REVIEW_FIXES results`

## Decisions needed from you

- **D1. What is the "tree view"?** There is none in the app. Is it (a) the sidebar nav (I restyle/regroup, optionally collapsible groups), (b) the Purdue levels on `/network`, (c) a hierarchy you expect (plant → unit → equipment), which would be a new feature needing your approval?
- **D2. Sidebar grouping:** accept the 7-group proposal above (Settings pinned to the footer, Simulator under Maintenance)? Group labels, not routes, change.
- **D3. Duplicate routes:** `/equipment` and `/equipment/detail`, `/handover` and `/data-sources` render identical pages. Keep both (paths fixed) and just label them, or make `/equipment/detail` show a "select equipment" state?
- **D4. Static Dashboard text** ("Ratnagiri LNG Phase 2", "42,400 tags active"): keep as text or source from `plantInfo`?
- **D5. T10 contrast:** raise `--text-quaternary` (a design-system token) or leave?
- **D6. KPI numeral colours:** keep status colours on the numbers, or make all numerals neutral and carry status only on the delta/dot?
- **D7. Session scope (d3):** keep per-tab `sessionStorage`, or persist across tabs?
- **D8. Chart ranges:** Alarm Frequency 30 → 14 days OK?
- **D9. Scope of the icon pass:** all ~26 pages, or Dashboard/Alarms/Equipment first?

## Decisions (recorded after the audit review)

- **D1.** Option (a) only: the sidebar, with collapsible groups. No hierarchy is built. No tree view exists in PlantMind; the reviewer's tree-view item likely refers to the BOM Sync EBOM tree; asked reviewer to confirm.
- **D2.** 7-group sidebar, Settings pinned in the footer, groups collapsible (open/closed state remembered per viewer in `localStorage`, wrapped in try/catch). No route path changes.
- **D3.** `/equipment/detail` with nothing selected shows a "Select equipment" empty state linking to `/equipment`. `/handover` vs `/data-sources`: investigate why both render the same page; fix if it is a mapping mistake, show before building any new page.
- **D4.** "Ratnagiri LNG Phase 2" and "42,400 tags active" stay as static text.
- **D5.** Raise `--text-quaternary` to at least 4.5:1 on white and on the dark container (light and dark). Logged as a Chronus deviation.
- **D6.** KPI numeral colours stay threshold-driven only.
- **D7.** Session persists across tabs (`localStorage`, same keys and shape as today). Logout clears it in every tab. `/login` redirects to the dashboard when signed in. Visible Logout button in the top bar (role-menu entry stays).
- **D8.** Alarm Frequency stays at 30 days; fix readability with `minTickGap` / `interval` / `preserveStartEnd`.
- **D9.** Icons on all pages (Dashboard, Alarms, Equipment first). Rule: one 14px `text-icon-tertiary` icon top-right of every KPI tile; leading 13px icon on primary action buttons; 24px icon in empty states; panel-header icons only on the Dashboard. All via `icons.ts`, one icon = one meaning.
- **Order:** login flow, OEE, functional fixes, sidebar, icons, graphs, consistency, QA. Stop after the login flow and OEE commits for review.

## Environment note

Servers started for this audit: preview on port **4180**, dev on port **5180**. A stale server from an earlier session was found on **4173** and stopped. All of them are stopped now.
