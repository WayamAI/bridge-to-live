// One mapping for every icon in the app. One icon, one meaning: nothing here is used for two things.
// Icons are lucide, stroke 1.75 (set once in index.css), greyscale (`text-icon-*`); colour only where the icon itself is a status.
import {
  Activity, AlertTriangle, ArrowRightLeft, ArrowUpDown, ArrowUpToLine, BadgeCheck, Beaker, Bell, BarChart3, Brain, Cable, Check, CheckCircle2,
  ChevronDown, ChevronRight, ChevronUp, CircleHelp, ClipboardCheck, Clock, Cpu, Database, Factory, Eye, EyeOff, FileCheck, FileWarning,
  Gauge, HardHat, Hourglass, LayoutDashboard, Leaf, ListChecks, Lock, LogOut, Mail, MapPin, Menu, Moon, MonitorSpeaker, Network, PanelLeftClose,
  PanelLeftOpen, Radar, RefreshCw, RotateCcw, Save, Scale, Search, Settings, Shield, Sigma, Sliders, Sun, Target, TrendingDown,
  TrendingUp, User, Users, Wallet, Wrench, X, Zap, type LucideIcon,
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
} as const;

/** Icon sizes by context (tailwind classes). */
export const iconSize = {
  puck: "size-[17px]", // sidebar
  bar: "size-4", // top bar, page header
  row: "size-3.5", // tree rows, table rows, meta lines
  pill: "size-[13px]", // inline in pills and buttons
  chevron: "size-3", // chevrons
} as const;
