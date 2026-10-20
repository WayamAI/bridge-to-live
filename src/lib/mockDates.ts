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
