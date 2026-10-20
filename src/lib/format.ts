// One place for number, date and time formatting. Everything is pinned to en-IN (lakh grouping)
// so the output does not depend on the browser locale.
const LOCALE = "en-IN";

const pad = (n: number) => String(n).padStart(2, "0");

/** Number with en-IN grouping (12,34,567). Same precision as `toLocaleString()` unless `options` says otherwise. */
export const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string =>
  value.toLocaleString(LOCALE, options);

/** Absolute date as ISO YYYY-MM-DD, in the viewer's local time. */
export const formatDate = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** Year and month as ISO YYYY-MM, in the viewer's local time. */
export const formatYearMonth = (date: Date): string => `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

/** Short month name (Apr), pinned to en-IN. */
export const formatMonthName = (date: Date): string => date.toLocaleDateString(LOCALE, { month: "short" });

/**
 * Clock time as 24-hour HH:mm in India Standard Time. The zone is pinned (not the viewer's) because the
 * top bar labels the clock "IST".
 */
export const formatTime = (date: Date): string =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Asia/Kolkata" }).format(date);

/** "rate_of_change" -> "rate of change": every underscore becomes a space (CSS capitalises where it is shown). */
export const formatKey = (key: string): string => key.replace(/_/g, " ");

/** "2024-04" -> the time of the first of that month (UTC), for a numeric chart axis. NaN for anything else. */
export const yearMonthToTime = (ym: string): number => {
  const m = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(ym);
  return m ? Date.UTC(Number(m[1]), Number(m[2]) - 1, 1) : NaN;
};

/** Month and two-digit year (Apr 24), pinned to en-IN and UTC to match yearMonthToTime. */
export const formatMonthYear = (time: number): string =>
  new Date(time).toLocaleDateString(LOCALE, { month: "short", year: "2-digit", timeZone: "UTC" });
