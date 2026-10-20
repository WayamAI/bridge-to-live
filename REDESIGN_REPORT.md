# REDESIGN_REPORT.md

Chronus-style UI redesign of PlantMind (Wayam AI), the app in this repo (`bridge-to-live`). Baseline: `aeabd3f`. Head: the commit that adds the Tickets section and the decisions (the one before it is `60b007d`).

Claims were checked against git (`git diff aeabd3f HEAD`, `git ls-files`) and against the running app where possible. Corrections to numbers or statements in earlier reports and in internal docs (not in repo) are marked **Corrected**. The internal docs (not in repo) keep the per-page log (every wording change, page by page); this file is the summary.

## Commits (aeabd3f..HEAD, oldest first)

Hashes in this section are from the original local history. The pushed branch carries the same commits rebased onto the team's main, with the internal docs left out, so its hashes differ. Two commits that changed only the internal docs (`aa0650d`, `bb1b25d`) are not in the branch.

46 commits before the final docs commit (47 in total).

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
| 60b007d | docs: redesign report update |
| this commit | docs: redesign tickets and decisions |

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
- `src/assets/brand/wayam-mark-light.svg`, `wayam-mark-dark.svg`, `wayam-wordmark-light.svg`, `wayam-wordmark-dark.svg`, `login-bg.jpg`
- `src/assets/marks/mark-*.png` (25 page marks, see Assets)
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
10. Fonts stay Google-hosted (decision, see Decisions). Chronus self-hosts its fonts at build time through `next/font`; this app is Vite, so an offline or air-gapped deployment would need the font files self-hosted later (`.woff2` plus `@font-face`, and the Google links removed).
11. **Text contrast (review round, ticket T10).** `--text-quaternary` is raised to at least 4.5:1 (WCAG AA) on every surface it sits on, light and dark: light `#8a8a8a` -> `#6e6e6e` (5.10:1 on white, 4.55:1 on the page), dark `#626262` -> `#858585` (5.16:1 on the container, 4.76:1 on raised). `--text-tertiary` moved with it to keep the order secondary > tertiary > quaternary: light `#737373` -> `#5c5c5c`, dark `#8a8a8a` -> `#a3a3a3`. These are Chronus token values; Chronus itself uses the lighter ones. A test (`src/test/contrast.test.ts`) fails if either ratio drops below 4.5:1.

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

## Assets (login image and page marks)

Added after Step 7. Raw originals (25 page icons in `icons/`, `login-bg.jpg` in the repo root) stay untracked and are ignored by the root-anchored rules `/icons/` and `/login-bg.jpg` in `.gitignore`. Only the processed copies are tracked.

- **Login image:** `src/assets/brand/login-bg.jpg`, 2400 x 1205, 175 kB (limit 400 kB). Used only by `Login.tsx` (brand panel, always dark, bottom gradient, logo top-left, "PlantMind" bottom-left).
- **Page marks:** `src/assets/marks/mark-<slug>.png`, 25 files, 256 x 256 RGBA with transparent corners and no white halo on light or dark (checked on both contact sheets). 33 to 65 kB each. **Over 60 kB:** `mark-failure-analysis.png` (65 kB), `mark-threat-monitor.png` (64 kB), `mark-settings.png` (63 kB).
- **Where they show:** only in `PageHeader` (44 px, `sm` and up, `alt=""`). Below `sm` and on any route without a mark, the lucide icon is shown instead. `markForPath` in `lib/icons.ts` maps route to file; a unit test checks every nav route has one.

| Raw file (`icons/`) | Mark | Page(s) |
|---|---|---|
| Control_room_console | `mark-dashboard` | Dashboard |
| Centrifugal_pump_3D_icon | `mark-equipment` | Plant Overview, Equipment Detail (shared) |
| Magnifying_glass_analyzing_crack | `mark-failure-analysis` | Failure Analysis |
| Hourglass_beside_gear | `mark-rul` | Remaining Useful Life |
| Wrench_crossed_with_crystal_ball | `mark-predictive-maintenance` | Predictive Maintenance |
| Clipboard_with_checklist_and_wrench | `mark-work-orders` | Work Orders |
| Stack_of_coins_and_gear | `mark-maintenance-cost` | Maintenance Cost |
| Lightning_bolt_in_electricity_meter | `mark-energy` | Energy Consumption |
| Balance_scale_with_lightning_bolt | `mark-load-optimisation` | Load Optimisation |
| Leaf_wrapped_around_factory_chimney | `mark-sustainability` | Sustainability |
| Industrial_alarm_beacon_on_pole | `mark-alarms` | Active Alarms |
| Bell_and_bar_chart_icon | `mark-alarm-analytics` | Alarm Analytics |
| Bell_inside_funnel_3D_icon | `mark-alarm-rationalisation` | Alarm Rationalisation |
| Industrial_controller_modules | `mark-ot-assets` | OT Asset Registry |
| Shield_radar_sweep_icon | `mark-threat-monitor` | Threat Monitor |
| Stacked_tiles_connected_by_cables | `mark-network` | Network Segmentation |
| Compliance_badge_icon_rendering | `mark-compliance` | Compliance |
| Hands_passing_document_folder | `mark-handover` | Handover Tracker |
| Cubes_linked_by_circular_arrow | `mark-twin-sync` | Twin Sync |
| Cylinder_database_3D_icon | `mark-data-completeness` | Data Completeness |
| Document_with_check-mark_stamp | `mark-iso-validator` | ISO Validator |
| Branching_path_icon_with_sliders | `mark-simulator` | Simulator |
| Three_devices_linked_to_hub | `mark-data-sources` | Connected Systems |
| Database_icon_with_check_mark | `mark-data-quality` | Data Quality |
| Two_cogs_meshed_together | `mark-settings` | Settings |

25 raw files, 25 marks, 26 routes (the pump serves two). No file maps to two different pages and no page lacks a file. `/login` and `/no-such-page` have no mark. **Corrected:** the Step 7 note "No entity marks: the repo has no PNG assets for them" no longer applies; page marks exist as above (still no per-entity marks).

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

## Tickets

One entry per pre-existing bug (numbers match the "Pre-existing bugs" list above). None was fixed in this redesign. Line numbers are at the head commit.

### High

**T1. Chart and mock data change on every render or reload (bug 2).**
- Where: `components/dashboard/AlarmFrequencyChart.tsx:15-17`, `PlantHealthTrend.tsx:13`, `EquipmentHeatMap.tsx:48`, `pages/AlarmAnalytics.tsx:12-14,22-23`, `FailureAnalysis.tsx:22-23`, `LoadOptimisation.tsx:40-41`, `RemainingUsefulLife.tsx:44-47`; the sensor jitter in `hooks/usePlantData.ts:111,649` is intended (live feel).
- Reproduce: open the Dashboard and reload; the Alarm Frequency bars, the Plant Health line and the heat-map scores are different each time (heat map and Plant Health also change when the 2 s sensor tick re-renders).
- Fix: replace `Math.random()` with a seeded generator or fixed arrays in `useMemo`/module scope (or fetch real series once backend data exists).
- Priority: High (numbers on screen are not reproducible).

**T2. Dashboard "Handover Readiness" is hard-coded to 73% while the Handover page shows 83% (bug 8).**
- Where: `pages/Dashboard.tsx:38` (`const handoverPct = 73`) against `pages/HandoverTracker.tsx:18-20` (computed from the scorecard data).
- Reproduce: open `/` (73%) and `/handover` (83%).
- Fix: compute the Dashboard value from the same data (move the handover data to a shared hook or module) and drop the constant. "Ratnagiri LNG Phase 2" and "42,400 tags active" are also static text.
- Priority: High (two screens disagree about the same number).

**T3. Charts that do not draw what their legend or caption says (bug 3).**
- Where: Weibull survival `Line` inside an `AreaChart` (`pages/FailureAnalysis.tsx:117-124`); failure event scatter shows nothing (`FailureAnalysis.tsx:156-162`, no points match the filter data); Sustainability "Target" `Line` inside a `BarChart` (`pages/Sustainability.tsx:97`); RUL fleet-age `Line` inside an `AreaChart` (`pages/RemainingUsefulLife.tsx:92`); Plant Health legend lists "Forecast" and "PM Events" that are not drawn; RUL caption mentions a dashed PM line.
- Reproduce: open `/failure-analysis` (Weibull shows a band only, timeline panel is empty) and `/sustainability` (no target line over the water chart).
- Fix: use `ComposedChart` where a line sits on bars or areas; give the scatter data matching `x`/`y` keys; remove legend entries for series that do not exist.
- Priority: High (missing information).

**T4. Alarm type shows "Rate Of_change" (bug 1).**
- Where: `pages/AlarmManagement.tsx:117` (`alert.type.replace("_", " ")` replaces only the first underscore; `rate_of_change` becomes "rate of_change", capitalised by CSS).
- Reproduce: open `/alarms`, look at the Type column of the COMP-B-001 row.
- Fix: `replace(/_/g, " ")`.
- Priority: High (visible typo, one-line fix).

### Medium

**T5. Settings inputs reset when you leave the tab (bug 5).** `pages/SettingsPage.tsx:79-80` (uncontrolled `defaultValue`) with the panel unmounted on tab change (`activeTab === ... &&`). Reproduce: type a threshold, switch tab and back; the value is back to the original. Also "Save changes" only shows a toast. Fix: hold values in state (or a form) above the tabs and persist on save. Reproduced at `aeabd3f`.

**T6. Toasts ignore the app theme (bug 4).** `components/ui/sonner.tsx:1,7` reads the theme from `next-themes` with no provider, so it is always "system". Reproduce: set the app to dark with the OS in light mode and trigger "Save changes". Fix: read `useTheme` from `hooks/useTheme` instead.

**T7. Keyboard access (bug 6).** Rows with `onClick` and no key handler: `pages/EquipmentHealth.tsx:120`, `FailureAnalysis.tsx:101`, `LoadOptimisation.tsx:87`, `PredictiveMaintenance.tsx:94`, `components/dashboard/EquipmentHeatMap.tsx:75`, `pages/Dashboard.tsx:126`, What-If saved scenarios; sortable headers `EquipmentHealth.tsx:57-60`; chart bars. Reproduce: Tab through `/equipment`; rows and headers cannot be focused or activated. Fix: make the activating element a button (or add `tabIndex`, `role` and Enter/Space handlers).

**T8. React duplicate-key warning on /predictive-maintenance (bug 7).** `pages/PredictiveMaintenance.tsx:93-94` puts the key on the inner `<tr>` of a `<>` fragment. Reproduce: open the page with the console open. Fix: `<Fragment key={rec.id}>`.

**T9. Mock dates are in the past (bug 11).** `hooks/usePlantData.ts:156 onwards ` (maintenance and failure dates in April and May 2026) and `pages/WorkOrders.tsx` due dates. Reproduce: `/work-orders` shows 8 overdue; an equipment detail shows negative "days" (`components/twin/EquipmentDetail.tsx:14-17`). Fix: generate mock dates relative to today.

**T10. Low-contrast tertiary text (bug 19).** `--text-quaternary` is about 3.4:1 on white (`styles/tokens.css:22`), below WCAG AA for small text. A Chronus token value; raise it or stop using it for small text.

### Low

**T11. Six baseline lint errors (bug 13).** `pages/FailureAnalysis.tsx:82,161` (`any`), `pages/LoadOptimisation.tsx:46` (expression statement), `tailwind.config.ts` (`require`), `components/ui/command.tsx`, `components/ui/textarea.tsx` (empty interfaces). Reproduce: `npm run lint`. Fix each as listed.

**T12. Weak type and test coverage (bug 15, plus tests).** Root `tsconfig.json:15` has `"files": []`, so `npx tsc --noEmit` checks nothing (use `-p tsconfig.app.json`); `strictNullChecks` and `noImplicitAny` are off; the only baseline test asserted `true`. This redesign added 47 tests (status, formats, icons, primitives), none for pages. Fix: point the root script at the app config, turn strictness on in steps, add page smoke tests.

**T13. One 1.1 MB JS chunk.** `npm run build` warns (1,119 kB, 311 kB gzip). Fix: route-level `React.lazy` and split recharts.

**T14. Horizontal bar charts are cramped at 390 px (bug 18).** Fixed left margins: `FailureAnalysis.tsx:77` (120), `ComplianceDashboard.tsx:68` (140), `DataCompleteness.tsx:42` (150). Reproduce: open them at 390 px wide. Fix: smaller margin or a shorter label column on narrow screens.

**T15. Housekeeping (bugs 9, 10, 14, 16, 17).** Duplicate routes render identical pages (`/equipment` and `/equipment/detail`, `/handover` and `/data-sources`; `App.tsx`); `animate-pulse-subtle` is not defined anywhere; the top bar re-renders every second (`components/layout/TopBar.tsx:31,46`); `playwright.config.ts:4` points to a missing `./tests`; `README.md` and the package name `vite_react_shadcn_ts` are template leftovers.

## Decisions and open questions

Decided:
1. **Fonts: keep Google Fonts, no change.** Chronus self-hosts through `next/font` at build time; this Vite app would need self-hosting for an offline deployment (see Deviations 10).
2. **Pre-existing bugs: fix none.** Tickets above.
3. Medium severity and P3 stay blue (info).
4. Unused files stay (Cleanup ticket above).

Open, with the default applied (changes no behaviour, data or dependencies; revisit if you disagree):
5. **Dashboard heat map and other wide tables at 390 px.** Open: default applied: left as scrolling inside their panels (the heat map also scrolled at baseline); no code change.
6. **Sidebar starts expanded on desktop (Chronus starts as the rail).** Open: default applied: expanded, as already shipped.
7. **Tailwind stays on 3.4, not Chronus' v4.** Open: default applied: stay on 3.4 (the upgrade changes dependencies).
8. **Form labels in Title Case ("Predictive-Only Maintenance", "Simulate Equipment Failure", What-If sliders).** Open: default applied: left as is; the wording rule covers buttons, placeholders and messages only.
9. **The top-bar clock pinned to IST.** Open: default applied: pinned to `Asia/Kolkata`, as shipped; a viewer-local clock would need the label dropped.
10. **Page header icons, restored tab icons and the alarm and event icons.** Open: default applied: as shipped in Step 7 (one mapping file); change an icon in `src/lib/icons.ts`.
