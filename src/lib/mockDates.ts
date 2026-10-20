// Mock data was written on a fixed day, so its dates drifted into the past (negative "days", "overdue" everywhere,
// an empty "Upcoming maintenance"). These helpers keep every mock date at the same distance from today that it had
// from that day.

/** The day the mock data was written. */
export const MOCK_ANCHOR = Date.parse("2026-03-31");

const DAY = 86_400_000;

/** A date `days` from now (negative: in the past). */
export const daysFromNow = (days: number, now = Date.now()) => new Date(now + days * DAY);

/** An ISO date ("2026-04-20") moved so it is as far from `now` as it was from the anchor day. */
export const shiftDate = (iso: string, now = Date.now()) => new Date(now + (Date.parse(iso) - MOCK_ANCHOR));

/** Same as shiftDate, as "YYYY-MM-DD" for the pages that keep dates as strings. */
export const shiftIso = (iso: string, now = Date.now()) => shiftDate(iso, now).toISOString().slice(0, 10);

// Log-style rows (event logs, sync history) carry a wall-clock timestamp as text. They are shifted by one amount, so
// their order and spacing stay exactly as written and the newest row is a few minutes old.

/** The moment the mock logs were written (their newest rows are just before it), as the viewer's local time. */
export const LOG_ANCHOR = new Date(2026, 2, 30, 14, 30, 0).getTime();

const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-03-30 14:28:00" -> the same wall-clock text, moved by (now - LOG_ANCHOR). Anything else is returned unchanged. */
export const shiftTimestamp = (text: string, now = Date.now()): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(text);
  if (!m) return text;
  const t = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]).getTime() + (now - LOG_ANCHOR);
  const d = new Date(t);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};
