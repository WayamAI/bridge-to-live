import { useEffect, useState, type SyntheticEvent } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { icons, iconSize } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Alert } from "@/hooks/usePlantData";
import wayamMarkLight from "@/assets/brand/wayam-mark-light.svg";
import wayamMarkDark from "@/assets/brand/wayam-mark-dark.svg";
import wayamWordmarkLight from "@/assets/brand/wayam-wordmark-light.svg";
import wayamWordmarkDark from "@/assets/brand/wayam-wordmark-dark.svg";
import { locate, navGroups, type NavItem } from "./nav";

interface SidebarProps {
  alerts: Alert[];
  userRole: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  mobileOpen: boolean;
}

type Flyout = { group: string; label: string; top: number };

const scrollingGroups = navGroups.filter((g) => !g.pinned);
const pinnedGroups = navGroups.filter((g) => g.pinned);
const collapsibleSections = scrollingGroups.filter((g) => !g.flat).map((g) => g.section);

const Sidebar = ({ alerts, expanded, onToggleExpanded, mobileOpen }: SidebarProps) => {
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged).length;
  const { pathname } = useLocation();
  const activeSection = locate(pathname).group;

  // Accordion: one group open at a time, never remembered. The group holding the current page opens when you arrive in it.
  const [openSection, setOpenSection] = useState<string | null>(() => (collapsibleSections.includes(activeSection) ? activeSection : null));
  useEffect(() => {
    if (collapsibleSections.includes(activeSection)) setOpenSection(activeSection);
  }, [activeSection]);
  const toggleGroup = (section: string) => setOpenSection((o) => (o === section ? null : section));

  // Collapsed rail: hovering or focusing an item shows a label flyout to its right.
  // The nav column scrolls (and clips), so the flyout is position:fixed.
  const [flyout, setFlyout] = useState<Flyout | null>(null);
  const showFlyout = (e: SyntheticEvent<HTMLElement>, group: string, label: string) => {
    if (expanded) return;
    const r = e.currentTarget.getBoundingClientRect();
    setFlyout({ group, label, top: r.top + r.height / 2 });
  };
  const hideFlyout = () => setFlyout(null);

  // Below lg the sidebar is an off-canvas drawer and always shows its full layout.
  // From lg it is a 68px rail that expands to 240px; labels are shown only when expanded.
  const railOnly = expanded ? "" : "lg:hidden";

  const renderItem = (group: string, { to, label, icon, alertBadge }: NavItem) => {
    const count = alertBadge ? unacknowledgedAlerts : 0;
    return (
      <NavLink
        key={to}
        to={to}
        end
        aria-label={count > 0 ? `${label}, ${count} unacknowledged` : label}
        onMouseEnter={(e) => showFlyout(e, group, label)}
        onFocus={(e) => showFlyout(e, group, label)}
        onMouseLeave={hideFlyout}
        onBlur={hideFlyout}
        className={({ isActive }) =>
          cn(
            "group flex h-[34px] items-center gap-3 rounded-lg px-3 outline-none transition-colors duration-[180ms] ease-out focus-visible:ring-2 focus-visible:ring-active",
            !expanded && "lg:justify-center lg:px-0",
            isActive ? "bg-raised-2 text-foreground" : "text-tertiary hover:bg-raised hover:text-secondary-foreground",
          )
        }
      >
        {({ isActive }) => (
          <>
            <span className="relative grid size-[22px] shrink-0 place-items-center">
              <Icon name={icon} size={iconSize.sidebar} />
              {count > 0 && (
                <span className={cn("absolute -right-1 -top-1 hidden size-2 rounded-full bg-error ring-2 ring-container", !expanded && "lg:block")} aria-hidden />
              )}
            </span>
            <span className={cn("type-label-md flex-1 truncate text-left", isActive && "text-foreground", railOnly)}>{label}</span>
            {count > 0 && (
              <span className={cn("type-caption tabular rounded-full bg-error-badge px-1.5 py-0.5 text-badge", railOnly)} aria-hidden>
                {count}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className={cn(
        "z-50 flex h-full shrink-0 flex-col border-r border-hairline bg-container",
        "transition-[width,transform,visibility] duration-200 ease-out",
        "fixed inset-y-0 left-0 w-[240px] -translate-x-full lg:static lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "max-lg:invisible",
        expanded ? "lg:w-[240px]" : "lg:w-[68px]",
      )}
    >
      {/* Brand: mark only on the collapsed rail; mark + wordmark + app name when expanded and in the drawer */}
      <div className={cn("flex h-14 shrink-0 items-center border-b border-hairline px-3", !expanded && "lg:px-[18px]")}>
        <Link
          to="/"
          aria-label="Wayam AI, Drishti"
          className="flex min-w-0 items-center gap-2.5 rounded-[10px] outline-none focus-visible:ring-2 focus-visible:ring-active"
        >
          <img src={wayamMarkLight} alt="" className="h-auto w-8 shrink-0 dark:hidden" />
          <img src={wayamMarkDark} alt="" className="hidden h-auto w-8 shrink-0 dark:block" />
          <span className={cn("flex min-w-0 flex-col gap-0.5", railOnly)}>
            <img src={wayamWordmarkLight} alt="" className="h-5 w-auto self-start dark:hidden" />
            <img src={wayamWordmarkDark} alt="" className="hidden h-5 w-auto self-start dark:block" />
            <span className="type-eyebrow block truncate text-quaternary">Drishti</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <nav aria-label="Primary" className={cn("flex flex-col px-3 py-2", !expanded && "lg:px-[14px]")}>
          {scrollingGroups.map((group, gi) => {
            if (group.flat) {
              return <div key={group.section} className="flex flex-col">{group.items.map((item) => renderItem(group.section, item))}</div>;
            }
            const isOpen = openSection === group.section;
            const panelId = `nav-group-${group.section.replace(/\W+/g, "-").toLowerCase()}`;
            // A closed group must not hide a live alert count.
            const hiddenAlerts = !isOpen ? group.items.some((i) => i.alertBadge) && unacknowledgedAlerts > 0 : false;
            return (
              <div key={group.section} className="flex flex-col">
                {gi > 0 && <div className={cn("my-1 border-t border-hairline", expanded ? "-mx-3" : "-mx-3 lg:-mx-[14px]")} />}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleGroup(group.section)}
                  className={cn(
                    "type-eyebrow flex h-8 shrink-0 items-center justify-between gap-2 rounded-md px-3 text-quaternary outline-none transition-colors duration-[180ms] hover:text-secondary-foreground focus-visible:ring-2 focus-visible:ring-active",
                    railOnly && "lg:hidden",
                  )}
                >
                  <span className="truncate">{group.section}</span>
                  <span className="flex items-center gap-1.5">
                    {hiddenAlerts && <span className="size-1.5 rounded-full bg-error" aria-label={`${unacknowledgedAlerts} unacknowledged alarms`} />}
                    <Icon name={icons.chevron} size={iconSize.chevron} className={cn("opacity-60 grayscale transition-transform duration-[180ms]", !isOpen && "-rotate-90")} />
                  </span>
                </button>
                {/* On the rail (lg and up, not expanded) every group shows its icons; elsewhere the group follows its open state. */}
                <div id={panelId} className={cn("flex flex-col pb-1", !isOpen && (expanded ? "hidden" : "hidden lg:flex"))}>
                  {group.items.map((item) => renderItem(group.section, item))}
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer: pinned items (Settings), then collapse / expand (desktop rail only) */}
      <div className={cn("shrink-0 border-t border-hairline py-2", expanded ? "px-3" : "px-3 lg:px-[14px]")}>
        <nav aria-label="Settings" className="flex flex-col">
          {pinnedGroups.flatMap((g) => g.items.map((item) => renderItem(g.section, item)))}
        </nav>
        <button
          type="button"
          onClick={onToggleExpanded}
          aria-expanded={expanded}
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          className={cn(
            "group hidden h-[34px] w-full items-center gap-3 rounded-lg px-3 text-tertiary outline-none transition-colors duration-[180ms] hover:bg-raised hover:text-secondary-foreground focus-visible:ring-2 focus-visible:ring-active lg:flex",
            !expanded && "lg:justify-center lg:px-0",
          )}
        >
          <Icon name={icons.collapse} size={iconSize.sidebar} className={cn(!expanded && "-scale-x-100")} />
          <span className={cn("type-label-md", railOnly)}>{expanded ? "Collapse sidebar" : "Expand sidebar"}</span>
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
