// Which sidebar groups are open, remembered per viewer in localStorage. Storage can throw (private window, blocked site
// data) and can hold anything, so reads are validated and every access is wrapped.

export const NAV_GROUPS_KEY = "wayam-nav-groups";

export type OpenGroups = Record<string, boolean>;

/** The stored map, keeping only string -> boolean entries; null if nothing usable is stored. */
export function readOpenGroups(): OpenGroups | null {
  try {
    const raw = window.localStorage.getItem(NAV_GROUPS_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const out: OpenGroups = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) if (typeof v === "boolean") out[k] = v;
    return out;
  } catch {
    return null;
  }
}

export function writeOpenGroups(open: OpenGroups) {
  try {
    window.localStorage.setItem(NAV_GROUPS_KEY, JSON.stringify(open));
  } catch {
    /* the open/closed state lasts for this page load only */
  }
}

/**
 * Open state for every group: the stored choice where there is one, otherwise open (a first visit shows everything).
 * The group holding the current page is always open, so the active item is never hidden on arrival.
 */
export function initialOpenGroups(sections: string[], activeSection: string, stored: OpenGroups | null): OpenGroups {
  const out: OpenGroups = {};
  for (const s of sections) out[s] = s === activeSection ? true : stored?.[s] ?? true;
  return out;
}
