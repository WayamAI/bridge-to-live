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

/** Clock time as 24-hour HH:mm, in the viewer's local time. */
export const formatTime = (date: Date): string => `${pad(date.getHours())}:${pad(date.getMinutes())}`;
