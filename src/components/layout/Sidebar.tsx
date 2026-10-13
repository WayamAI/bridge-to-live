import { useState, type SyntheticEvent } from "react";
import { Link, NavLink } from "react-router-dom";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Alert } from "@/hooks/usePlantData";
import wayamMarkLight from "@/assets/brand/wayam-mark-light.svg";
import wayamMarkDark from "@/assets/brand/wayam-mark-dark.svg";
import wayamWordmarkLight from "@/assets/brand/wayam-wordmark-light.svg";
import wayamWordmarkDark from "@/assets/brand/wayam-wordmark-dark.svg";
import { navGroups } from "./nav";

interface SidebarProps {
  alerts: Alert[];
  userRole: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  mobileOpen: boolean;
}

const Sidebar = ({ alerts, expanded, onToggleExpanded, mobileOpen }: SidebarProps) => {
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  // Collapsed rail: hovering or focusing a puck shows a label flyout to its right.
  // The nav column scrolls (and clips), so the flyout is position:fixed.
  const [flyout, setFlyout] = useState<{ group: string; label: string; top: number } | null>(null);
  const showFlyout = (e: SyntheticEvent<HTMLElement>, group: string, label: string) => {
    if (expanded) return;
    const r = e.currentTarget.getBoundingClientRect();
    setFlyout({ group, label, top: r.top + r.height / 2 });
  };
  const hideFlyout = () => setFlyout(null);

  // Below lg the sidebar is an off-canvas drawer and always shows its full layout.
  // From lg it is a 68px rail that expands to 252px; labels are shown only when expanded.
  const railOnly = expanded ? "" : "lg:hidden";

  return (
    <aside
      className={cn(
        "z-50 flex h-full shrink-0 flex-col border-r border-hairline bg-container",
        "transition-[width,transform,visibility] duration-200 ease-out",
        "fixed inset-y-0 left-0 w-[252px] -translate-x-full lg:static lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "max-lg:invisible",
        expanded ? "lg:w-[252px]" : "lg:w-[68px]",
      )}
    >
      {/* Brand: mark only on the collapsed rail; mark + wordmark + app name when expanded and in the drawer */}
      <div className={cn("flex h-14 shrink-0 items-center border-b border-hairline px-3", !expanded && "lg:px-[18px]")}>
        <Link
          to="/"
          aria-label="Wayam AI, PlantMind"
          className="flex min-w-0 items-center gap-2.5 rounded-[10px] outline-none focus-visible:ring-2 focus-visible:ring-active"
        >
          <img src={wayamMarkLight} alt="" className="h-auto w-8 shrink-0 dark:hidden" />
          <img src={wayamMarkDark} alt="" className="hidden h-auto w-8 shrink-0 dark:block" />
          <span className={cn("flex min-w-0 flex-col gap-0.5", railOnly)}>
            <img src={wayamWordmarkLight} alt="" className="h-5 w-auto self-start dark:hidden" />
            <img src={wayamWordmarkDark} alt="" className="hidden h-5 w-auto self-start dark:block" />
            <span className="type-eyebrow block truncate text-quaternary">PlantMind</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <nav aria-label="Primary" className={cn("flex flex-col gap-1.5 px-3 py-3", !expanded && "lg:px-[14px]")}>
          {navGroups.map((group, gi) => (
            <div key={group.section} className="flex flex-col gap-1.5">
              {gi > 0 && <div className={cn("mx-1 my-1 border-t border-hairline", !expanded && "lg:mx-2")} />}
              <div className={cn("type-eyebrow px-1 pt-1 text-quaternary", railOnly)}>{group.section}</div>
              {group.items.map(({ to, label, icon: Icon, alertBadge }) => {
                const count = alertBadge ? unacknowledgedAlerts : 0;
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end
                    aria-label={count > 0 ? `${label}, ${count} unacknowledged` : label}
                    onMouseEnter={(e) => showFlyout(e, group.section, label)}
                    onFocus={(e) => showFlyout(e, group.section, label)}
                    onMouseLeave={hideFlyout}
                    onBlur={hideFlyout}
                    className="group flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-active"
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cn(
                            "relative grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-[180ms] ease-out",
                            isActive
                              ? "bg-action-primary text-on-color"
                              : "bg-action text-tertiary group-hover:bg-raised-2 group-hover:text-secondary-foreground",
                          )}
                        >
                          <Icon className="size-[17px]" aria-hidden />
                          {count > 0 && (
                            <span className={cn("absolute right-0 top-0 hidden size-2 rounded-full bg-error ring-2 ring-container", !expanded && "lg:block")} aria-hidden />
                          )}
                        </span>
                        <span
                          className={cn(
                            "type-label-sm flex-1 truncate text-left transition-colors duration-[180ms]",
                            isActive ? "text-foreground" : "text-tertiary group-hover:text-secondary-foreground",
                            railOnly,
                          )}
                        >
                          {label}
                        </span>
                        {count > 0 && (
                          <span className={cn("type-caption tabular rounded-full bg-error-badge px-1.5 py-0.5 text-badge", railOnly)} aria-hidden>
                            {count}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer: collapse / expand (desktop rail only) */}
      <div className={cn("hidden shrink-0 border-t border-hairline py-3 lg:block", expanded ? "px-3" : "px-[14px]")}>
        <button
          type="button"
          onClick={onToggleExpanded}
          aria-expanded={expanded}
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          className="group flex w-full items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-active"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-action text-tertiary transition-colors duration-[180ms] ease-out group-hover:bg-raised-2 group-hover:text-secondary-foreground">
            {expanded ? <icons.collapse className="size-[17px]" aria-hidden /> : <icons.expand className="size-[17px]" aria-hidden />}
          </span>
          <span className={cn("type-label-sm text-tertiary group-hover:text-secondary-foreground", railOnly)}>
            {expanded ? "Collapse sidebar" : "Expand sidebar"}
          </span>
        </button>
      </div>

      {flyout && !expanded && (
        <div
          role="presentation"
          style={{ top: flyout.top }}
          className="pointer-events-none fixed left-[76px] z-50 hidden -translate-y-1/2 rounded-xl border border-hairline bg-container px-3 py-2 shadow-lg lg:block"
        >
          <div className="type-eyebrow whitespace-nowrap text-quaternary">{flyout.group}</div>
          <div className="type-label-md whitespace-nowrap text-foreground">{flyout.label}</div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
