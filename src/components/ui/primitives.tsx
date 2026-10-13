import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import type { EquipmentStatus } from "@/hooks/usePlantData";
import { equipmentLabel, equipmentTone, type Tone } from "@/lib/status";

// Chronus shared primitives (CHRONUS_DESIGN_SYSTEM.md section 4), adapted for PlantMind.
// Components use semantic tokens only: bg-container, border-hairline, text-quaternary...

export type { Tone };

const toneText: Record<Tone, string> = {
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  error: "text-error",
  neutral: "text-tertiary",
};

const toneDot: Record<Tone, string> = {
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  error: "bg-error",
  neutral: "bg-quaternary",
};

/** Unit, percent or currency sign beside a Michroma value: Geist, same colour, slightly smaller. */
export const Unit = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cn("ml-0.5 font-sans text-[0.7em] tracking-normal", className)}>{children}</span>
);

/** Content card: 8px radius, hairline border, no shadow, optional eyebrow header. Titles are Title Case in source. */
export const Panel = ({
  title,
  action,
  padded = true,
  className,
  bodyClassName,
  children,
}: {
  title?: ReactNode;
  action?: ReactNode;
  padded?: boolean;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) => (
  <section className={cn("flex flex-col overflow-hidden rounded-lg border border-hairline bg-container", className)}>
    {title && (
      <header className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-hairline px-4">
        <h3 className="type-eyebrow truncate text-quaternary">{title}</h3>
        {action && <div className="shrink-0">{action}</div>}
      </header>
    )}
    <div className={cn("min-h-0 flex-1 overflow-auto", padded && "p-4", bodyClassName)}>{children}</div>
  </section>
);

/**
 * KPI tile: eyebrow label, Michroma tabular value, signed delta and hint.
 * `prefix` is for currency (₹) and `unit` for %, hr, /hr and similar; both render in Geist.
 * Pass the value already formatted (the caller owns number formatting).
 */
export const KpiTile = ({
  label,
  value,
  prefix,
  unit,
  delta,
  tone = "neutral",
  hint,
  onClick,
  className,
  valueClassName,
}: {
  label: string;
  value: ReactNode;
  prefix?: string;
  unit?: string;
  delta?: string;
  tone?: Tone;
  hint?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  className?: string;
  valueClassName?: string;
}) => {
  const body = (
    <>
      <span className="type-eyebrow truncate text-quaternary">{label}</span>
      <span className={cn("type-display-xl sm:type-display-2xl tabular text-foreground", valueClassName)}>
        {prefix && <Unit className="ml-0 mr-0.5">{prefix}</Unit>}
        {value}
        {unit && <Unit>{unit}</Unit>}
      </span>
      {(delta || hint) && (
        <span className="flex items-baseline gap-2">
          {delta && <span className={cn("type-body-sm tabular", toneText[tone])}>{delta}</span>}
          {hint && <span className="type-caption min-w-0 text-quaternary">{hint}</span>}
        </span>
      )}
    </>
  );
  const base = "flex min-w-0 flex-col gap-1.5 rounded-lg border border-hairline bg-container px-4 py-3.5 text-left";
  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={cn(base, "outline-none transition-colors duration-[150ms] hover:border-strong focus-visible:ring-2 focus-visible:ring-active", className)}
    >
      {body}
    </button>
  ) : (
    <div className={cn(base, className)}>{body}</div>
  );
};

export const StatusDot = ({ tone = "neutral", className }: { tone?: Tone; className?: string }) => (
  <span aria-hidden className={cn("inline-block size-1.5 shrink-0 rounded-full", toneDot[tone], className)} />
);

/** Normal states are quiet: a status dot and plain text. Reserve solid Badges for states that need attention. */
export const QuietStatus = ({ tone = "success", children, className }: { tone?: Tone; children: ReactNode; className?: string }) => (
  <span className={cn("type-body-sm inline-flex items-center gap-1.5 whitespace-nowrap text-tertiary", className)}>
    <StatusDot tone={tone} />
    {children}
  </span>
);

/**
 * Equipment status (the PlantMind counterpart of BOM Sync's LifecycleStatus).
 * Running, Offline and Maintenance are quiet (dot plus text; the dot carries the status colour that the
 * old UI showed). Warning and Critical need attention, so they get a solid badge.
 */
export const EquipmentStatusLabel = ({ status }: { status?: EquipmentStatus | null }) => {
  if (!status) return <span className="type-body-sm text-quaternary">—</span>;
  const label = equipmentLabel[status];
  if (status === "warning") return <Badge variant="warning">{label}</Badge>;
  if (status === "critical") return <Badge variant="error">{label}</Badge>;
  return <QuietStatus tone={equipmentTone[status]}>{label}</QuietStatus>;
};

/** Plain statement, no illustration, no call to action. */
export const EmptyState = ({ title = "Nothing to show", detail, className }: { title?: string; detail?: string; className?: string }) => (
  <div className={cn("flex min-h-[160px] flex-col items-center justify-center gap-1.5 px-6 text-center", className)}>
    <p className="type-body-md text-tertiary">{title}</p>
    {detail && <p className="type-body-sm text-quaternary">{detail}</p>}
  </div>
);

/** Pill select: a native select (so options, value and onChange are unchanged) with a Chronus chevron. */
export const PillSelect = ({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <span className="relative inline-flex">
    <select
      {...props}
      className={cn(
        "h-8 appearance-none rounded-full border border-hairline bg-action pl-3 pr-8 type-label-sm text-secondary-foreground outline-none transition-colors duration-[180ms] hover:border-strong hover:bg-raised-2 focus-visible:border-strong focus-visible:ring-2 focus-visible:ring-active",
        className,
      )}
    >
      {children}
    </select>
    <ChevronDown aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-quaternary" />
  </span>
);

/** Search pill: a plain text input with a leading search icon. */
export const SearchField = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <span className="relative inline-flex">
    <Search aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 size-[13px] -translate-y-1/2 text-quaternary" />
    <input
      {...props}
      className={cn(
        "h-8 w-52 rounded-full border border-hairline bg-action pl-8 pr-3 type-label-sm text-foreground outline-none transition-colors duration-[180ms] placeholder:text-quaternary hover:border-strong focus-visible:border-strong focus-visible:ring-2 focus-visible:ring-active",
        className,
      )}
    />
  </span>
);
