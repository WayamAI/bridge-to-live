# REDESIGN_REPORT.md

Chronus-style UI redesign of PlantMind (Wayam AI), the app in this repo (`bridge-to-live`). Baseline: `aeabd3f`. Head: the commit that adds this update (the one before it is `f46101c`, Step 7 icons).

Claims were checked against git (`git diff aeabd3f HEAD`, `git ls-files`) and against the running app where possible. Corrections to numbers or statements in earlier reports and in internal docs (not in repo) are marked **Corrected**. The internal docs (not in repo) keep the per-page log (every wording change, page by page); this file is the summary.

## Commits (aeabd3f..HEAD, oldest first)

Hashes in this section are from the original local history. The pushed branch carries the same commits rebased onto the team's main, with the internal docs left out, so its hashes differ.

45 commits before this update.

| Commit | Message |
|---|---|
| 981e194 | ui: step 1 chronus tokens and fonts |
| aa0650d | docs: audit updates after step 1 |
| d1fe401 | ui: step 2 chronus app shell |
| c26257e | ui: step 2 follow-ups |
| ac41765 | ui: step 3a chronus shared primitives |
| ae3dd8c | ui: step 3b chronus tables (restyle only) |
| 849f830 | ui: fix dark pill contrast regression |
| 41986ec | ui: fix dark variant selector so dark: utilities follow the .dark class |
| b3e3e22 | ui: step 3c chronus charts |
| c338f2a | ui: chart colour semantics |
| 71a56cc | ui: step 4 dashboard |
| a967890 | ui: step 4 active alarms |
| 5a5e355 | ui: step 4 equipment health |
| a4cfc84 | ui: purdue and category colour fixes |
| a02dc2e | ui: step 4 failure analysis |
| f9d4fba | ui: step 4 remaining useful life |
| 55321c6 | ui: step 4 predictive maintenance |
| e2e6aea | ui: step 4 work orders |
| 3461244 | ui: step 4 maintenance cost |
| 48d3b60 | ui: step 4 energy consumption |
| bf783bd | ui: step 4 load optimisation |
| 1072d75 | ui: step 4 sustainability |
| 49c03cb | ui: step 4 alarm analytics |
| 162e201 | ui: step 4 alarm rationalisation |
| ac306d1 | ui: step 4 ot asset registry |
| df55e78 | ui: step 4 threat monitor |
| b109154 | ui: step 4 network segmentation |
| 74046bf | ui: step 4 compliance dashboard |
| f525af2 | ui: step 4 handover tracker |
| c174c15 | ui: step 4 twin sync |
| 249b941 | ui: step 4 data completeness |
| 7b0d498 | ui: step 4 iso validator |
| cee94fe | ui: step 4 what-if simulator |
| 4583ff8 | ui: step 4 data quality |
| e502d2c | ui: step 4 settings |
| f133312 | ui: step 4 login |
| 11e4f7c | ui: step 4 not found |
| bb1b25d | docs: step 4 summary and step 5 list |
| c638d5f | ui: step 5 formats (also carries the Step 4 integrity-audit record in internal docs (not in repo)) |
| 1f074c1 | ui: step 5 wording |
| 38953d8 | ui: step 5 a11y |
| e9b9205 | ui: step 5 follow-ups |
| 93bd213 | docs: redesign report |
| f3c4ccc | ui: final qa fixes |
| f46101c | ui: step 7 icons |

## Diff stat against aeabd3f, by area

Excluding internal docs (not in repo) and this file: 59 files changed, 3169 insertions, 2178 deletions. 16 files added (not counting this file), 44 modified, none deleted or renamed.

| Area | Files | Change |
|---|---|---|
| Config and global styles | `index.html`, `tailwind.config.ts`, `src/index.css`, `src/styles/tokens.css` (new) | 4 files, +331 −129 |
| Layout shell | `AppLayout`, `Sidebar`, `TopBar`, `PageHeader` (new), `nav.ts` (new) | 5 files, +330 −202 |
| UI primitives | `ui/badge.tsx`, `ui/primitives.tsx` (new) | 2 files, +235 −5 |
| Dashboard components | `AlarmFrequencyChart`, `EquipmentHeatMap`, `MaintenanceTimeline`, `PlantHealthTrend`, `chartTheme.ts` (new) | 5 files, +120 −96 |
| Twin components | `EquipmentDetail`, `FactoryFloor`, `OEEDashboard`, `SensorSparkline`, `AlertsPanel`, `EquipmentTable` | 6 files, +103 −114 |
| Pages | 26 route pages | 26 files, +1384 −1632 |
| Logic helpers | `lib/status.ts`, `lib/format.ts`, `lib/icons.ts` (all new) | 3 files, +329 |
| Brand assets | four new SVGs | 4 files, +126 |
| Tests | `format.test.ts`, `icons.test.ts`, `primitives.test.tsx`, `status.test.ts` (all new) | 4 files, +211 |
| Docs | internal docs (not in repo), this file | |

## New files

- `src/styles/tokens.css`
- `src/components/layout/nav.ts`
- `src/components/layout/PageHeader.tsx`
- `src/components/ui/primitives.tsx`
- `src/components/dashboard/chartTheme.ts`
- `src/lib/status.ts`
- `src/lib/format.ts`
- `src/lib/icons.ts`
- `src/assets/brand/wayam-mark-light.svg`, `wayam-mark-dark.svg`, `wayam-wordmark-light.svg`, `wayam-wordmark-dark.svg`
- `src/test/format.test.ts`, `src/test/icons.test.ts`, `src/test/primitives.test.tsx`, `src/test/status.test.ts`
- `REDESIGN_REPORT.md`

## Untouched files

Zero diff against `aeabd3f` (checked with `git diff --name-only` against `git ls-files`): 96 tracked files. Outside `src/components/ui`:

- Config and root: `.gitignore`, `README.md`, `components.json`, `eslint.config.js`, `package.json`, `package-lock.json`, `bun.lockb`, `playwright.config.ts`, `playwright-fixture.ts`, `postcss.config.js`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `vitest.config.ts`
- `public/` (`favicon.ico`, `favicon.svg`, `placeholder.svg`, `robots.txt`)
- Logic: `src/App.tsx`, `src/main.tsx`, `src/vite-env.d.ts`, `src/lib/utils.ts`, all of `src/hooks/` (`useAuth`, `useTheme`, `usePlantData`, `useFactoryData`, `use-mobile`, `use-toast`)
- Original logos: `src/assets/logos/*` (three SVGs)
- Not-routed legacy files, never opened: `Logo`, `NavLink`, `EngagementTimeline`, `GapAnalysis`, `MetricsBar`, `PhaseTracker`, `TransitionRequirements`, `TwinComparison`, `twin/KPICards`, `pages/Index`, `pages/PlaceholderPage`, `App.css`
- Tests: `src/test/example.test.ts`, `src/test/setup.ts`

48 of the 49 `src/components/ui/*` files have zero diff; only `badge.tsx` and the new `primitives.tsx` changed. Routes, auth, data and mock data are therefore untouched: `App.tsx` (the route table), `useAuth`, `useTheme` (storage key `wayam-theme` unchanged) and `usePlantData` have no diff.

## Login contract

Checked in a browser against `aeabd3f`. Unchanged:

- Field ids `email` and `password`, input types, `autoComplete` values, placeholders (`you@example.com`, `••••••••`)
- Labels "Email" and "Password", the show and hide password `aria-label`s
- Heading and button text "Sign in"
- Validation message "Enter any email and password to continue."
- The auth call `login(email.trim())` followed by `navigate(from, { replace: true })`
- Redirect of unauthenticated routes to `/login`

Copy changes: "Demo build — enter any email…" is now "Demo build. Enter any email…"; footer "Wayam AI — PlantMind demo environment" is now "Wayam AI · PlantMind demo environment"; the old "by Wayam AI" line is gone. The brand panel shows the Wayam mark and wordmark and "PlantMind" only.

## Dependencies

No change. `package.json`, `package-lock.json` and `bun.lockb` have no diff against `aeabd3f` (`git diff --stat aeabd3f..HEAD -- package.json package-lock.json bun.lockb` is empty). Tailwind stays on 3.4. No new packages: charts still use recharts, motion still framer-motion. Fonts: Geist and Michroma replace Inter and JetBrains Mono, still loaded from Google Fonts like the old fonts (the old `@import` moved from `index.css` to `<link>` tags in `index.html`).

## Brand and shell

- Sidebar and login use the Wayam mark and wordmark SVGs (light and dark pairs, `dark:hidden` / `dark:block`). The old `Logo` component and `assets/logos` are untouched and now unused (**Corrected:** earlier notes did not say `Logo.tsx` became unused; it is imported nowhere).
- Sidebar: 252px expanded (default, a deviation: Chronus defaults to the rail), 68px rail with label flyout, off-canvas drawer below `lg`. Nav items are links, routes, labels, groups and order unchanged (`nav.ts` checked line by line against the baseline array). Alarm badge counts unacknowledged alerts, as before.
- Top bar: h-14, group eyebrow, sr-only h1 (the only h1 on a page; page titles are h2 in `PageHeader`), live dot, IST clock, tag count, theme toggle, role menu.
- Light is the default; dark via `.dark` or `[data-theme="dark"]` (tailwind `darkMode` variant changed accordingly).

## Shared primitives

In `src/components/ui/primitives.tsx`: `Unit`, `Panel`, `KpiTile`, `StatusDot`, `QuietStatus`, `ToneStatus`, `EquipmentStatusLabel`, `EmptyState`, `PillSelect`, `SearchField`, `Chip`. Also `PageHeader` in `layout/` and the `badge` variants (`success`, `info`, `warning`, `error`, `neutral`).

In `src/components/dashboard/chartTheme.ts`: `seriesColor`, `chartTooltipStyle`, `chartTooltipLabelStyle`, `axisTick`. Charts use CSS variables only, so they follow the theme.

In `src/lib/format.ts`: `formatNumber`, `formatDate`, `formatYearMonth`, `formatMonthName`, `formatTime`.

In `src/lib/icons.ts`: `navIcon`, `iconForPath`, `alarmIcon`, `eventIcon`, `settingsTabIcon`, `icons`, `iconSize` (see Icons below).

## Mappings

**Status colour mapping (`lib/status.ts`).** Old PlantMind colours: operational → success, gap → warning, destructive → error, engineering → info. Alarm severity: critical error, warning warning, info info. Priority P1 to P4: error, warning, info, neutral (**P3 changes from indigo to blue**). Equipment: running success, warning warning, critical error, offline neutral, maintenance info. Threat severity: critical error, high warning, medium info, low neutral. Workflow states (work order, recommendation, opportunity, chattering, rationalisation, patch, threat, handover, validation, data source, complexity, zone) each have one map. Quiet text and dot is the default; a solid badge marks the states that need attention (Emergency, Awaiting Parts, Chattering, End-of-life, Critical and High threats, Investigating, At risk, Fail, Degraded, At Risk completeness, red zones). Every lookup goes through `workflowTone`, `toneOf` or `labelOf`: an unknown value shows as quiet neutral text with the raw label and never throws (unit-tested per map).

**Chart colours (`chartTheme.ts`, `tokens.css`).** Series 1 to 6: blue, green, orange, red, grey, purple, then repeat (`--analytics-series-1..6`, a lighter purple in dark). Meaning-bearing fills use `toneChart`: info series 1, success 2, warning 3, error 4, neutral 5. Axis ticks 11px quaternary, no axis or tick lines, tooltip on the container surface.

**Text styles.** `cn()` uses tailwind-merge, which treats unknown `text-*` names as colours, so the Chronus type scale is named `type-*`:

| Chronus | This repo |
|---|---|
| caption | `type-caption` |
| label sm / md | `type-label-sm` / `type-label-md` |
| body sm / md / lg | `type-body-sm` / `-md` / `-lg` |
| display base / lg / xl / 2xl | `type-display-*` (Michroma, weight 400) |
| eyebrow | `type-eyebrow` + `text-quaternary` |
| border muted / default | `border-hairline` / `border-strong` |

**Icons (`lib/icons.ts`, Step 7).** One file maps every icon. `navIcon` gives each route one lucide icon; the sidebar, `nav.ts` and the page header (`PageHeader` looks the icon up by route) all read it, so a page shows the same icon in the sidebar and in its header. `alarmIcon()` and `eventIcon()` replace the three local `typeIcons` maps and return a `CircleHelp` fallback for an unknown type (no throw). Settings tabs show their icons again through `settingsTabIcon`. Stroke 1.75 comes from one rule in `index.css`. Icons are greyscale (`text-icon-primary` to `text-icon-quaternary`, tailwind colours aliasing the text tokens); colour only where the icon is itself a status. Sizes by context: sidebar 17, top bar and page header 16, rows 14, pills and buttons 13, chevrons 12. All decorative icons are `aria-hidden`. No entity marks: the repo has no PNG assets for them, and none were created.

One icon, one meaning. Icons that had two meanings and how they were resolved (details in internal docs (not in repo), "Step 7 icons"): BarChart3 (Cost Tracker now Wallet), Clock (RUL now Hourglass), Lock (Compliance now BadgeCheck), Database (Settings models tab now Sigma), Bolt and Zap (Load Optimisation now Scale), Shield (safety alarm type now HardHat), AlertTriangle for three alarm types (now Radar, ArrowUpToLine, TrendingUp), Brain and BrainCircuit (now Brain), and the Dashboard quick actions (each now uses its destination's sidebar icon). Wrench, Brain, Bell and Zap are shared on purpose because the meaning is the same.

## Before and after per page

The internal docs (not in repo) ("Step 4 page log") have the full per-page list. Summary:

- **All pages:** PageHeader (title from `nav.ts`, one-sentence description), KPI tiles instead of tinted cards, `Panel` for every table and chart, eyebrow table headers with hairline rows, `tabular` numbers, quiet status text with solid badges only for states needing attention, sentence-case buttons, "No … match this filter" empty rows on filterable tables, `aria-hidden` on decorative icons, focus rings on every control.
- **Dashboard:** five KPI tiles, heat map with quiet cells (warning and error tint below 85 and 65), alert list with severity dots, timeline with an empty state, quick actions in the header.
- **Active Alarms:** header filters, P1 to P4 circles, quiet severity dots, acknowledge pill.
- **Equipment Health (two routes):** search and selects in the header, equipment status label, sortable headers with `aria-sort`.
- **Charts pages (Failure Analysis, RUL, Maintenance Cost, Sustainability, Alarm Analytics, Compliance, Data Completeness):** theme-aware flat charts, status colours by meaning.
- **Tables pages (Work Orders, OT Asset Registry, Threat Monitor, ISO Validator, Data Quality, Twin Sync, Handover):** chips for filters, quiet status, solid attention badges.
- **What-If Simulator:** sliders, switch and select restyled; every `min`, `max`, `step`, `value` and `onChange` unchanged; labels now linked to controls.
- **Settings:** chip tabs (`aria-pressed`, as the baseline had plain buttons), pill inputs, uncontrolled inputs kept.
- **Login and Not Found:** split layout; centred 404.

## Deliberate changes

- **Number formatting pinned to `en-IN`** through `lib/format.ts` (lakh grouping above 99,999); 25 `toLocaleString()` calls in 11 files replaced at the same precision. (**Corrected:** the Step 5 report said 30 call sites in 12 files; the shadcn `ui/chart.tsx` call was reverted because its value type does not fit, and the count was 25 in 11.) `ui/chart.tsx` keeps one unpinned call (unused component).
- **Dates:** ISO `YYYY-MM-DD` in chart axes and the maintenance timeline; RUL axis `YYYY-MM` (was "May 25"); Load Optimisation keeps short month names ("Apr"), pinned to `en-IN`. Mock data untouched.
- **Clock:** 24-hour `HH:mm`, seconds dropped, and **pinned to `Asia/Kolkata`** so the "IST" label is true for every viewer (before, it was the viewer's local time). A deliberate change, not a bug fix.
- **Final QA fixes (Step 6b):** the KPI unit gap ("6 (L0–L4+DMZ)", "6 days ago") is a word space again; Alarm Rationalisation and Load Optimisation fit at 1440 again (cell padding `px-2`, narrower Rationale and Opportunity columns, wrapping Annual Saving header); the three date axes use `preserveStartEnd` with `minTickGap` so ISO labels no longer overlap or clip.
- **Icons (Step 7):** see Icons under Mappings. Visible changes: icons in page headers and Settings tabs; Cost Tracker, RUL, Compliance, Load Optimisation, models-tab and the safety, anomaly, threshold and rate-of-change alarm icons changed to resolve duplicate meanings; row icons 12 to 14 and pill icons 12 to 13.
- Pulse animations are static (live dot, FactoryFloor ring, sync spinner replaced by its label).
- Decorative KPI and header icons removed.
- Medium severity and P3 are blue (info), not indigo or orange.
- Logo split into mark and wordmark files; originals kept.
- Wording: descriptions, panel titles (middle dot instead of em dash), sentence-case labels, and separator edits in Step 5. 69 text edits in Step 4 plus 6 in Step 5 (5 places), every one listed in internal docs (not in repo).
- Accessibility: roles and `aria-checked` on the load-optimisation checkboxes and the what-if switch, `aria-sort` on sortable headers, `htmlFor` and ids on the what-if sliders, switch and select (six new ids), `aria-label`s on icon-only buttons and search fields, a shell h1.
- `FactoryFloor` and `AlertsPanel` (both unrouted) got an `aria-label` and focus rings.
- Unknown status values render as quiet neutral text (the baseline showed plain text), tested.
- Removed from view: the `Purdue` level `color` field (only fed a border colour), `breadcrumb` rendering (no caller ever passed one), the unused `SensorSparkline` import in Energy.

## Deviations from Chronus

1. 19 page `<h1>` became `<h2>`; the shell h1 is the only h1.
2. Theme toggle and role menu stay in the top bar (Chronus: sidebar footer); the Settings group stays in the nav list.
3. Sidebar is expanded by default on desktop (Chronus default is the rail).
4. Nav items are links, not buttons; same targets.
5. A second quiet info line (clock, tag count) under the top bar below `lg`.
6. Pulse animations removed; Dashboard quick actions sit in the PageHeader; page filters sit in the PageHeader actions or a toolbar row.
7. The OEE rings keep their 1 s fill animation (logic inside the component).
8. Login brand panel is a solid colour (no hero image in the repo).
9. Tailwind stays on 3.4 (Chronus is v4).
10. Fonts stay Google-hosted.

## Cleanup ticket (unused files, left in place on purpose)

- **No importer anywhere, zero diff:** `Logo.tsx` (**new fact:** unused since the shell and login use the brand SVGs), `NavLink.tsx`, `EngagementTimeline.tsx`, `GapAnalysis.tsx`, `MetricsBar.tsx`, `PhaseTracker.tsx`, `TransitionRequirements.tsx`, `TwinComparison.tsx`, `twin/KPICards.tsx`, `pages/Index.tsx`, `pages/PlaceholderPage.tsx`, `App.css`, `hooks/useFactoryData.ts` (only the unused components import it).
- **No importer, but edited for format or accessibility:** `twin/AlertsPanel.tsx`, `twin/EquipmentTable.tsx`.
- **Imported but never rendered:** `FactoryFloor` (imported by Dashboard and EquipmentHealth); touched in Step 4 and Step 5.
- **Unused shadcn `ui/*`:** app code imports only `primitives`, `sonner`, `toast`, `toaster` and `tooltip` directly (plus `badge` through `primitives`); the rest are unchanged and have no app importer.

## Pre-existing bugs (not fixed)

1. Alarm type label shows "Rate Of_change" (the code replaces only the first underscore).
2. `Math.random()` in render or `useMemo`: AlarmFrequencyChart, PlantHealthTrend, EquipmentHeatMap, LoadOptimisation, AlarmAnalytics, so values change per mount.
3. Charts that do not render what their legend or caption says: the Weibull survival `Line` inside an `AreaChart`, the failure event scatter (no matching points), the Sustainability target `Line` inside a `BarChart`; Plant Health legend lists "Forecast" and "PM Events", RUL caption mentions a dashed PM line.
4. Sonner toasts follow the OS theme (`next-themes` with no provider).
5. Settings inputs are uncontrolled and reset when you leave the tab; "Save changes" only shows a toast. **Reproduced at `aeabd3f`.**
6. Clickable rows (EquipmentHealth, FailureAnalysis, LoadOptimisation, PredictiveMaintenance, EquipmentHeatMap, Dashboard alert list, what-if saved scenarios), sortable headers and chart bars have no keyboard activation. No handlers were added.
7. `/predictive-maintenance` logs a React duplicate-key warning (fragment rows with the key on the inner `<tr>`). Exempt in the sweep.
8. `Dashboard` hard-codes `handoverPct = 73` while the Handover page shows 83%; "Ratnagiri LNG Phase 2" and "42,400 tags active" are static text.
9. `/equipment` and `/equipment/detail`, and `/handover` and `/data-sources`, render identical pages.
10. `animate-pulse-subtle` (AlarmManagement) is not defined anywhere.
11. EquipmentDetail shows negative "days" for past mock dates; Work Orders shows all "overdue" because mock dates are in the past.
12. ~~`typeIcons[alert.type]` throws for an unknown alarm or event type.~~ **Corrected:** fixed in Step 7; `alarmIcon()` and `eventIcon()` fall back to `CircleHelp`. Every lookup in the app now has a fallback.
13. Six baseline lint errors (`any` x2 in FailureAnalysis, a ternary statement in LoadOptimisation, `require()` in the tailwind config, two empty interfaces in unused `ui/command.tsx` and `ui/textarea.tsx`) and nine react-refresh warnings.
14. `TopBar` re-renders every second (clock state at the top of the shell tree).
15. Root `tsc --noEmit` checks nothing (`files: []`); the real gate is `tsc -p tsconfig.app.json`.
16. Playwright config points to `./tests`, which does not exist.
17. `README.md` and the package name `vite_react_shadcn_ts` are template leftovers.
18. Horizontal bar charts keep fixed left margins and are cramped at 390px.
19. `text-quaternary` is about 3.4:1 on white, below WCAG AA for small text. A Chronus token choice.

## Verification

| Gate | Baseline `aeabd3f` | Final |
|---|---|---|
| `tsc -p tsconfig.app.json --noEmit` | 0 errors | 0 errors |
| `npm test` | 1 file, 1 test | 5 files, 48 tests, all passing |
| `npm run build` | OK, 2903 modules, JS 1,116.66 kB (308 kB gzip), CSS 71.24 kB | OK, JS 1,119.31 kB (about 311 kB gzip), CSS 78.52 kB |
| `npm run lint` | 15 problems (6 errors, 9 warnings) | 15 problems (6 errors, 9 warnings), the same ones |
| Route sweep (28 routes x light/dark x 1440/390 = 112 combos) | 48 failing combos (7 routes with h1=0, duplicate-key warning, 17 routes overflowing at 390px) | 4 failing combos, all the exempt `/predictive-maintenance` duplicate-key warning; every route has one h1 and no horizontal overflow |

Test files: `example` (baseline), `primitives`, `status`, `format`, `icons`. The final sweep and all gates were run on the Step 7 commit.

Full-height QA: every route captured at its full scroll height (the script grows the viewport to `main`'s scroll height; no app change) in light and dark at 1440, plus 390 for the six tallest pages (Dashboard, OT Asset Registry, Compliance, Failure Analysis, Network Segmentation, Handover Tracker). Screenshots were looked at as light and dark contact sheets, again after Step 7.

### Found and fixed in final QA (all regressions from earlier steps)

- **Corrected:** the Step 5 and Step 6 reports said the Network tile reading "6(L0–L4+DMZ)" and the wide Alarm Rationalisation and Load Optimisation tables were just listed items. Compared with `aeabd3f` they were regressions (baseline had the space and both tables fitted at 1440), and are fixed.
- **Corrected:** the Step 5 report said the ISO date labels were fine. At 390 px the Plant Health Trend labels overlapped and the last tick on both Dashboard charts was clipped; fixed.
- The Dashboard heat map did scroll at baseline (463 in 404 px at 1440), so it is listed, not a regression; it is tighter now (603 in 386 px) because of the wider sidebar and the Chronus cell padding.

### Looks off (not fixed, listed)

- Dashboard: the equipment heat map table is wider than its panel, so its last column ("Vibration") sits behind a horizontal scroll (baseline also scrolled).
- At 390 px the wide tables (OT Assets, Handover, Failure Analysis, heat map) scroll inside their panels, which is accepted at 390.
- Equipment Health and Dashboard: the right-hand detail column is an empty panel until a row is selected (same as baseline).
- Failure Analysis: the event timeline panel is empty (pre-existing scatter bug).
- Handover Tracker shows 83% readiness while the Dashboard tile shows 73% (hard-coded, pre-existing).

## Decisions and open questions

Answered:
1. Medium severity and P3 stay blue (info).
2. Unused files stay; they are listed under Cleanup ticket above.
3. Horizontal scroll at 1440: the two regressions are fixed; the Dashboard heat map also scrolled at baseline, so it is listed.

Not answered (your last message had template placeholders in these two places, so I changed nothing):
4. **Fonts.** The message read "[self-host Geist and Michroma as .woff2 under src/assets/fonts … OR keep Google Fonts]". Fonts are still loaded from Google Fonts at runtime (as at baseline). Say "self-host" and I will add the .woff2 files, the `@font-face` rules and drop the Google links; it needs the font files fetched once.
5. **Pre-existing bugs.** The message had "[your answers to the other three]". They remain listed above; say which ones should be fixed or ticketed (the visible ones are "Rate Of_change", the `Math.random()` chart data and the charts that do not render).
