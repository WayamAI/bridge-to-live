// One mapping for every icon in the app: concept -> icon file (src/assets/icons/{48,96}/<name>.png), rendered by <Icon />.
// One icon, one meaning: a file is used for two things only where the two are the same thing (named in icons.test.ts).
// The icons are generated 3D art in colour; status icons carry the status colour in the file itself.
import type { IconName } from "@/components/ui/Icon";

/** Sidebar icon per route. The page header shows the same icon as its sidebar item (on phones, where the page mark is hidden). */
export const navIcon: Record<string, IconName> = {
  "/": "icon-nav-dashboard",
  "/equipment": "icon-nav-plant-overview",
  "/equipment/detail": "icon-nav-equipment-detail",
  "/failure-analysis": "icon-nav-failure-analysis",
  "/rul": "icon-nav-remaining-life",
  "/predictive-maintenance": "icon-nav-predictive-maintenance",
  "/work-orders": "icon-nav-work-orders",
  "/maintenance-cost": "icon-nav-maintenance-cost",
  "/energy": "icon-nav-energy",
  "/load-optimisation": "icon-nav-load-optimisation",
  "/sustainability": "icon-nav-sustainability",
  "/alarms": "icon-nav-alarms",
  "/alarm-analytics": "icon-nav-alarm-analytics",
  "/alarm-rationalisation": "icon-nav-alarm-rationalisation",
  "/ot-assets": "icon-nav-ot-assets",
  "/threat-monitor": "icon-nav-threat-monitor",
  "/network": "icon-nav-network",
  "/compliance": "icon-nav-compliance",
  "/handover": "icon-nav-handover",
  "/twin-sync": "icon-nav-twin-sync",
  "/data-completeness": "icon-nav-data-completeness",
  "/iso-validator": "icon-nav-iso-validator",
  "/simulator": "icon-nav-simulator",
  "/data-sources": "icon-nav-data-sources",
  "/data-quality": "icon-nav-data-quality",
  "/settings": "icon-nav-settings",
};

/** Icon for a route; the fallback is never rendered for a known route. */
export const iconForPath = (pathname: string): IconName | undefined => navIcon[pathname];

/** Alarm types. Predictive and maintenance share their meaning (and icon) with the same words elsewhere. */
export const alarmTypeIcon: Record<string, IconName> = {
  anomaly: "icon-alarm-type-anomaly",
  threshold: "icon-alarm-type-threshold",
  rate_of_change: "icon-alarm-type-rate-of-change",
  predictive: "icon-nav-predictive-maintenance",
  maintenance: "icon-maintenance",
  safety: "icon-alarm-type-safety",
};

/** Maintenance event types. */
export const eventTypeIcon: Record<string, IconName> = {
  "Planned PM": "icon-maintenance",
  Predictive: "icon-nav-predictive-maintenance",
  "Warranty Expiry": "icon-event-warranty-expiry",
};

/** Shown for a type the maps do not know (never throws). */
export const unknownTypeIcon: IconName = "ctl-unknown-type";

export const alarmIcon = (type: string): IconName => alarmTypeIcon[type] ?? unknownTypeIcon;
export const eventIcon = (type: string): IconName => eventTypeIcon[type] ?? unknownTypeIcon;

/** Settings tab icons. */
export const settingsTabIcon: Record<string, IconName> = {
  thresholds: "icon-settings-thresholds",
  alerts: "icon-nav-alarms",
  models: "icon-settings-models",
  users: "icon-settings-users",
};

/** Meaning icons used outside the nav, and the controls. */
export const icons = {
  alarms: "icon-nav-alarms", // alarms and alerts
  maintenance: "icon-maintenance", // maintenance work
  warning: "icon-status-warning", // something needs attention (out of range, predicted failure)
  acknowledge: "icon-status-ok", // acknowledged is the "ok" state
  location: "icon-location",
  manufacturer: "icon-manufacturer",
  search: "ctl-search",
  filter: "ctl-filter",
  close: "ctl-close",
  sync: "icon-action-sync",
  reset: "icon-action-reset",
  save: "icon-action-save",
  password: "ctl-field-lock",
  email: "ctl-field-mail",
  showPassword: "ctl-password-show",
  hidePassword: "ctl-password-hide",
  sort: "ctl-sort",
  selected: "ctl-check",
  signOut: "ctl-sign-out",
  account: "ctl-account",
  menu: "ctl-menu",
  themeLight: "ctl-theme-light",
  themeDark: "ctl-theme-dark",
  collapse: "ctl-collapse", // the expand control is this one mirrored with CSS (scaleX(-1))
  chevron: "ctl-chevron", // points down; rotate with CSS for the other directions
  createWorkOrder: "icon-action-create-work-order", // start a work order from a recommendation
} as const satisfies Record<string, IconName>;

/**
 * KPI tile icons, one per meaning (not per page): the same thing gets the same icon wherever it is counted.
 * 20px, top-right of the tile. Alarms keep the bell they have in the sidebar.
 */
export const kpi = {
  health: "icon-kpi-health", // plant or source health
  alarms: "icon-nav-alarms", // alarms and alerts as a count
  alarmsPending: "icon-kpi-alarms-pending", // alarms waiting for someone
  alarmRate: "icon-kpi-alarm-rate", // how often alarms fire
  alarmState: "icon-kpi-alarm-state", // time spent in a high-alarm state
  critical: "icon-kpi-critical", // critical events and alarms
  failures: "icon-kpi-failures", // failures, predicted or past
  mostFailing: "icon-kpi-most-failing", // the worst offender
  downtime: "icon-kpi-downtime",
  duration: "icon-kpi-duration", // response, acknowledgement and other elapsed times
  mtbf: "icon-kpi-mtbf", // mean time between failures
  trend: "icon-kpi-trend", // direction over time
  time: "icon-kpi-time", // a point in time (last sync, freshness)
  cost: "icon-kpi-cost", // any cost or price
  savings: "icon-kpi-savings",
  spend: "icon-kpi-spend",
  budget: "icon-kpi-budget",
  variance: "icon-kpi-variance",
  ratio: "icon-kpi-ratio",
  count: "icon-kpi-count", // a plain total
  percent: "icon-kpi-percent", // a rate or coverage
  groups: "icon-kpi-groups", // zones, domains, levels, categories
  assets: "icon-kpi-assets",
  completeness: "icon-kpi-completeness",
  pending: "icon-kpi-pending",
  chattering: "icon-kpi-chattering",
  ok: "icon-kpi-ok", // passing, complete, up to date, done
  error: "icon-kpi-error", // errors and failing checks
  gap: "icon-kpi-gap", // a gap or open issue
  below: "icon-kpi-below", // under a threshold
  findings: "icon-kpi-findings", // findings and investigations
  events: "icon-kpi-events",
  compliance: "icon-kpi-compliance",
  risk: "icon-kpi-risk",
  unmonitored: "icon-kpi-unmonitored",
  connections: "icon-kpi-connections",
  patch: "icon-kpi-patch",
  endOfLife: "icon-kpi-end-of-life",
  records: "icon-kpi-records",
  actions: "icon-kpi-actions", // actions and reviewed items
  opportunity: "icon-kpi-opportunity",
  open: "icon-kpi-open",
  inProgress: "icon-kpi-in-progress",
  overdue: "icon-kpi-overdue",
  handover: "icon-kpi-handover",
  electricity: "icon-kpi-electricity", // electricity and energy efficiency
  steam: "icon-kpi-steam",
  water: "icon-kpi-water",
  air: "icon-kpi-air",
  gas: "icon-kpi-gas",
  emissions: "icon-kpi-emissions",
  target: "icon-kpi-target",
} as const satisfies Record<string, IconName>;

/** Energy page tiles are named by the data, so their icons are looked up by label. */
export const energyKpiIcon: Record<string, IconName> = {
  "Electrical load": kpi.electricity,
  "Steam consumption": kpi.steam,
  "Cooling water flow": kpi.water,
  "Compressed air": kpi.air,
  "Natural gas": kpi.gas,
  "Energy cost rate": kpi.cost,
};

/** Empty-state icons (48px). One per kind of emptiness. */
export const emptyIcon = {
  nothing: "icon-empty-nothing", // there is simply nothing here
  noMatch: "icon-empty-no-match", // a search or filter matched nothing
  select: "icon-empty-select", // pick something to see it
  noAlerts: "icon-empty-no-alerts",
  noEvents: "icon-empty-no-events",
} as const satisfies Record<string, IconName>;

/** The 404 illustration (96px). */
export const notFoundIcon: IconName = "icon-error-not-found";

/** Panel-header icons: used on the Dashboard only. */
export const panelIcon = {
  healthTrend: "icon-panel-health-trend",
  alarmFrequency: "icon-panel-alarm-frequency",
  heatMap: "icon-panel-heat-map",
  upcoming: "icon-panel-upcoming",
  oee: "icon-panel-oee",
  alerts: "icon-nav-alarms",
} as const satisfies Record<string, IconName>;

/** Status icons, one per tone (the colour is in the file). Used wherever a status dot used to sit beside text. */
export const statusIcon = {
  success: "icon-status-ok",
  info: "icon-status-info",
  warning: "icon-status-warning",
  error: "icon-status-critical",
  neutral: "icon-status-neutral",
} as const satisfies Record<string, IconName>;

/** Trend arrows (up and down are coloured in the file; the flat one is grey). */
export const trendIcon = {
  up: "icon-trend-up",
  down: "icon-trend-down",
  flat: "icon-trend-flat",
} as const satisfies Record<string, IconName>;

/** Equipment class icon, by the equipment's `type` (falling back to its class code). Undefined when the class has no icon. */
const equipmentTypeIcon: Record<string, IconName> = {
  pump: "icon-equip-pump",
  compressor: "icon-equip-compressor",
  valve: "icon-equip-valve",
  motor: "icon-equip-motor",
  vessel: "icon-equip-vessel",
  heat_exchanger: "icon-equip-heat-exchanger",
  turbine: "icon-equip-turbine",
  substation: "icon-equip-substation",
  safety_valve: "icon-equip-safety-valve",
  generator: "icon-equip-generator",
  analyser: "icon-equip-analyser",
  air_cooler: "icon-equip-air-cooler",
  transmitter: "icon-equip-transmitter",
};
const equipmentCodeIcon: Record<string, IconName> = {
  PUMP: "icon-equip-pump",
  COMP: "icon-equip-compressor",
  FCV: "icon-equip-valve",
  MOT: "icon-equip-motor",
  V: "icon-equip-vessel",
  HEX: "icon-equip-heat-exchanger",
  TURB: "icon-equip-turbine",
  PSV: "icon-equip-safety-valve",
  GEN: "icon-equip-generator",
  AT: "icon-equip-analyser",
  AGC: "icon-equip-air-cooler",
  TT: "icon-equip-transmitter",
  PT: "icon-equip-transmitter",
  FT: "icon-equip-transmitter",
  LT: "icon-equip-transmitter",
};
export const equipmentClassIcons = Object.values(equipmentTypeIcon);
export const equipmentIcon = (eq: { type?: string; equipmentClass?: string }): IconName | undefined =>
  (eq.type && equipmentTypeIcon[eq.type]) || (eq.equipmentClass && equipmentCodeIcon[eq.equipmentClass]) || undefined;

/** OT device types on the OT Asset Registry. */
export const otTypeIcon: Record<string, IconName> = {
  DCS: "icon-ot-dcs",
  PLC: "icon-ot-plc",
  HMI: "icon-ot-hmi",
  RTU: "icon-ot-rtu",
  Historian: "icon-ot-historian",
  "Engineering workstation": "icon-ot-workstation",
  "OT switch": "icon-ot-switch",
  "OT firewall": "icon-ot-firewall",
  SIS: "icon-ot-sis",
  "Smart sensor": "icon-ot-smart-sensor",
};

/** Purdue network zones, by level label ("Level 3.5"). */
export const networkZoneIcon: Record<string, IconName> = {
  "Level 4": "icon-network-level-4",
  "Level 3.5": "icon-network-level-3-5",
  "Level 3": "icon-network-level-3",
  "Level 2": "icon-network-level-2",
  "Level 1": "icon-network-level-1",
  "Level 0": "icon-network-level-0",
};

/** Icon sizes by context, in px (the Icon component picks the 48px file up to 24px and the 96px file above). */
export const iconSize = {
  sidebar: 22, // sidebar rows and the collapse control
  kpi: 20, // KPI tiles
  header: 20, // page-header icon on phones (the 44px mark replaces it from sm up)
  button: 16, // inside buttons
  row: 16, // table rows, list items, meta lines, panel headers
  control: 16, // search, close, sort, menu, theme, account and similar controls
  chevron: 14, // chevrons
  empty: 48, // empty states
  notFound: 96, // the 404 page
} as const;

// Page marks: generated 3D illustrations (src/assets/marks), shown only in the page header, decorative.
const markFiles = import.meta.glob<string>("../assets/marks/mark-*.png", { eager: true, import: "default" });

/** Mark file slug per route. /equipment and /equipment/detail share the pump; /data-sources is "Connected Systems". */
export const markSlug: Record<string, string> = {
  "/": "dashboard",
  "/equipment": "equipment",
  "/equipment/detail": "equipment",
  "/failure-analysis": "failure-analysis",
  "/rul": "rul",
  "/predictive-maintenance": "predictive-maintenance",
  "/work-orders": "work-orders",
  "/maintenance-cost": "maintenance-cost",
  "/energy": "energy",
  "/load-optimisation": "load-optimisation",
  "/sustainability": "sustainability",
  "/alarms": "alarms",
  "/alarm-analytics": "alarm-analytics",
  "/alarm-rationalisation": "alarm-rationalisation",
  "/ot-assets": "ot-assets",
  "/threat-monitor": "threat-monitor",
  "/network": "network",
  "/compliance": "compliance",
  "/handover": "handover",
  "/twin-sync": "twin-sync",
  "/data-completeness": "data-completeness",
  "/iso-validator": "iso-validator",
  "/simulator": "simulator",
  "/data-sources": "data-sources",
  "/data-quality": "data-quality",
  "/settings": "settings",
};

/** URL of the mark for a route, or undefined (the lucide icon is shown instead). */
export const markForPath = (pathname: string): string | undefined => {
  const slug = markSlug[pathname];
  return slug ? markFiles[`../assets/marks/mark-${slug}.png`] : undefined;
};
