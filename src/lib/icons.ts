// One mapping for every icon in the app. One icon, one meaning: nothing here is used for two things.
// Icons are lucide, stroke 1.75 (set once in index.css), greyscale (`text-icon-*`); colour only where the icon itself is a status.
import {
  Activity, AlertTriangle, ArrowRightLeft, ArrowUpDown, ArrowUpToLine, BadgeCheck, Beaker, Bell, BarChart3, Brain, Cable, Check, CheckCircle2,
  ChevronDown, ChevronRight, ChevronUp, CircleHelp, ClipboardCheck, Clock, Cpu, Database, Factory, Eye, EyeOff, FileCheck, FileWarning,
  Gauge, HardHat, Hourglass, LayoutDashboard, Leaf, ListChecks, Lock, LogOut, Mail, MapPin, Menu, Moon, MonitorSpeaker, Network, PanelLeftClose,
  PanelLeftOpen, Radar, RefreshCw, RotateCcw, Save, Scale, Search, Settings, Shield, Sigma, Sliders, Sun, Target, TrendingDown,
  TrendingUp, User, Users, Wallet, Wrench, X, Zap, type LucideIcon,
Archive, ArrowDownToLine, AudioWaveform, Ban, BellRing, Boxes, CalendarClock, CalendarDays, CalendarRange, ChartColumn, ChartSpline, CheckCheck, CircleAlert, CircleCheckBig, CircleDashed, CircleGauge, CircleX, ClipboardList, ClipboardPlus, Cloud, CloudDownload, CloudFog, Crosshair, Diff, Droplets, Flag, Flame, FileSearch, Grid3x3, HeartPulse, History, Inbox, IndianRupee, Landmark, Layers, Lightbulb, LineChart, ListTodo, Loader, MousePointerClick, OctagonAlert, PackageCheck, PackageOpen, PiggyBank, Plug, PlugZap, PowerOff, Receipt, Repeat, Rows3, ScanEye, ScanSearch, SearchX, ShieldAlert, ShieldCheck, Siren, Split, Tags, Timer, Vibrate, Waypoints, Wind, Percent, Hash, PieChart as PieChartIcon, BellOff, CalendarCheck,
} from "lucide-react";

/** Sidebar icon per route. The page header shows the same icon as its sidebar item. */
export const navIcon: Record<string, LucideIcon> = {
  "/": LayoutDashboard,
  "/equipment": Activity,
  "/equipment/detail": Cpu,
  "/failure-analysis": TrendingDown,
  "/rul": Hourglass,
  "/predictive-maintenance": Brain,
  "/work-orders": ListChecks,
  "/maintenance-cost": Wallet,
  "/energy": Zap,
  "/load-optimisation": Scale,
  "/sustainability": Leaf,
  "/alarms": Bell,
  "/alarm-analytics": BarChart3,
  "/alarm-rationalisation": Target,
  "/ot-assets": MonitorSpeaker,
  "/threat-monitor": Shield,
  "/network": Network,
  "/compliance": BadgeCheck,
  "/handover": ArrowRightLeft,
  "/twin-sync": Cable,
  "/data-completeness": FileCheck,
  "/iso-validator": ClipboardCheck,
  "/simulator": Beaker,
  "/data-sources": Database,
  "/data-quality": Gauge,
  "/settings": Settings,
};

/** Icon for a route; the fallback is never rendered for a known route. */
export const iconForPath = (pathname: string): LucideIcon | undefined => navIcon[pathname];

/** Alarm types. Predictive and maintenance share their meaning (and icon) with the same words elsewhere. */
export const alarmTypeIcon: Record<string, LucideIcon> = {
  anomaly: Radar,
  threshold: ArrowUpToLine,
  rate_of_change: TrendingUp,
  predictive: Brain,
  maintenance: Wrench,
  safety: HardHat,
};

/** Maintenance event types. */
export const eventTypeIcon: Record<string, LucideIcon> = {
  "Planned PM": Wrench,
  Predictive: Brain,
  "Warranty Expiry": FileWarning,
};

/** Shown for a type the maps do not know (never throws). */
export const unknownTypeIcon: LucideIcon = CircleHelp;

export const alarmIcon = (type: string): LucideIcon => alarmTypeIcon[type] ?? unknownTypeIcon;
export const eventIcon = (type: string): LucideIcon => eventTypeIcon[type] ?? unknownTypeIcon;

/** Settings tab icons. */
export const settingsTabIcon: Record<string, LucideIcon> = {
  thresholds: Sliders,
  alerts: Bell,
  models: Sigma,
  users: Users,
};

/** Meaning icons used outside the nav. Each icon appears once in this file's values below the nav and type maps. */
export const icons = {
  alarms: Bell, // alarms and alerts
  maintenance: Wrench, // maintenance work
  warning: AlertTriangle, // something needs attention (out of range, predicted failure)
  acknowledge: CheckCircle2,
  time: Clock,
  location: MapPin,
  manufacturer: Factory,
  search: Search,
  close: X,
  sync: RefreshCw,
  reset: RotateCcw,
  save: Save,
  password: Lock,
  email: Mail,
  showPassword: Eye,
  hidePassword: EyeOff,
  sort: ArrowUpDown,
  selected: Check,
  signOut: LogOut,
  account: User,
  menu: Menu,
  themeLight: Sun,
  themeDark: Moon,
  collapse: PanelLeftClose,
  expand: PanelLeftOpen,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  createWorkOrder: ClipboardPlus, // start a work order from a recommendation
} as const;

/**
 * KPI tile icons, one per meaning (not per page): the same thing gets the same icon wherever it is counted.
 * Greyscale, 14px, top-right of the tile. Alarms keep the bell they have in the sidebar.
 */
export const kpi = {
  health: HeartPulse, // plant or source health
  alarms: Bell, // alarms and alerts as a count
  alarmsPending: BellRing, // alarms waiting for someone
  alarmRate: AudioWaveform, // how often alarms fire
  alarmState: Siren, // time spent in a high-alarm state
  critical: OctagonAlert, // critical events and alarms
  failures: Ban, // failures, predicted or past
  mostFailing: Flag, // the worst offender
  downtime: PowerOff,
  duration: Timer, // response, acknowledgement and other elapsed times
  mtbf: Repeat, // mean time between failures
  trend: LineChart, // direction over time
  time: Clock, // a point in time (last sync)
  cost: IndianRupee, // any cost or price
  savings: PiggyBank,
  spend: Receipt,
  budget: Landmark,
  variance: Diff,
  ratio: Split,
  count: Hash, // a plain total
  percent: Percent, // a rate or coverage
  groups: Layers, // zones, domains, levels
  categories: Tags,
  assets: Boxes,
  completeness: PieChartIcon,
  freshness: History,
  review: ClipboardList, // reviewed items
  pending: CircleDashed,
  chattering: Vibrate,
  ok: CircleCheckBig, // passing, complete, up to date
  done: CheckCheck, // finished work
  error: CircleX, // errors and failing checks
  gap: CircleAlert, // a gap or open issue
  below: ArrowDownToLine, // under a threshold
  findings: FileSearch,
  investigation: ScanSearch,
  events: CalendarDays,
  compliance: ShieldCheck,
  risk: ShieldAlert,
  unmonitored: ScanEye,
  connections: Waypoints,
  patch: CloudDownload,
  endOfLife: Archive,
  records: Rows3,
  actions: ListTodo,
  opportunity: Lightbulb,
  open: PackageOpen,
  inProgress: Loader,
  overdue: CalendarClock,
  handover: PackageCheck,
  efficiency: Plug,
  electricity: PlugZap,
  steam: CloudFog,
  water: Droplets,
  air: Wind,
  gas: Flame,
  emissions: Cloud,
  target: Crosshair,
} as const;

/** Energy page tiles are named by the data, so their icons are looked up by label. */
export const energyKpiIcon: Record<string, LucideIcon> = {
  "Electrical load": kpi.electricity,
  "Steam consumption": kpi.steam,
  "Cooling water flow": kpi.water,
  "Compressed air": kpi.air,
  "Natural gas": kpi.gas,
  "Energy cost rate": kpi.cost,
};

/** Empty-state icons (24px). One per kind of emptiness. */
export const emptyIcon = {
  nothing: Inbox, // there is simply nothing here
  noMatch: SearchX, // a search or filter matched nothing
  select: MousePointerClick, // pick something to see it
  noAlerts: BellOff,
  noEvents: CalendarCheck,
} as const;

/** Panel-header icons: used on the Dashboard only. */
export const panelIcon = {
  healthTrend: ChartSpline,
  alarmFrequency: ChartColumn,
  heatMap: Grid3x3,
  upcoming: CalendarRange,
  oee: CircleGauge,
  alerts: Bell,
} as const;

/** Icon sizes by context (tailwind classes). */
export const iconSize = {
  puck: "size-[17px]", // sidebar
  bar: "size-4", // top bar, page header
  row: "size-3.5", // tree rows, table rows, meta lines
  pill: "size-[13px]", // inline in pills and buttons
  chevron: "size-3", // chevrons
  kpi: "size-3.5", // KPI tiles (14px)
  empty: "size-6", // empty states (24px)
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
