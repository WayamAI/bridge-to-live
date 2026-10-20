import { describe, expect, it } from "vitest";
import { LOG_ANCHOR, MOCK_ANCHOR, daysFromNow, shiftDate, shiftIso, shiftTimestamp } from "@/lib/mockDates";

const DAY = 86_400_000;

describe("mock dates", () => {
  it("keeps a date the same distance from now as it was from the anchor day", () => {
    const now = Date.parse("2027-01-15T10:00:00Z");
    expect(shiftDate("2026-04-20", now).getTime() - now).toBe(Date.parse("2026-04-20") - MOCK_ANCHOR);
    expect((shiftDate("2026-04-20", now).getTime() - now) / DAY).toBe(20);
  });

  it("puts an upcoming event inside the next 60 days whenever the app is opened", () => {
    [Date.parse("2026-10-20"), Date.parse("2028-02-29"), Date.now()].forEach((now) => {
      const d = shiftDate("2026-04-25", now).getTime();
      expect(d).toBeGreaterThan(now);
      expect(d).toBeLessThan(now + 60 * DAY);
    });
  });

  it("keeps past dates in the past and gives string dates in ISO form", () => {
    const now = Date.parse("2026-10-20T00:00:00Z");
    expect(shiftDate("2026-03-10", now).getTime()).toBeLessThan(now);
    expect(shiftIso("2026-04-20", now)).toBe("2026-11-09");
  });

  it("daysFromNow offsets from the given time", () => {
    expect(daysFromNow(9, 0).getTime()).toBe(9 * DAY);
    expect(daysFromNow(-1, 0).getTime()).toBe(-DAY);
  });

  it("shifts log timestamps together, keeping order and spacing", () => {
    const now = new Date(2026, 9, 20, 17, 0, 0).getTime();
    const rows = ["2026-03-30 14:28:00", "2026-03-30 14:27:30", "2026-03-30 10:00:00", "2026-03-24 08:14:22"];
    const out = rows.map((r) => shiftTimestamp(r, now));
    expect(out[0]).toBe("2026-10-20 16:58:00"); // 2 minutes before now, as 14:28 was 2 minutes before the anchor
    const ms = (s: string) => new Date(s.replace(" ", "T")).getTime();
    for (let i = 1; i < rows.length; i++) {
      const before = new Date(rows[0].replace(" ", "T")).getTime() - new Date(rows[i].replace(" ", "T")).getTime();
      expect(ms(out[0]) - ms(out[i])).toBe(before);
    }
    expect(shiftTimestamp("2026-03-30 14:30:00", now)).toBe("2026-10-20 17:00:00");
    expect(LOG_ANCHOR).toBe(new Date(2026, 2, 30, 14, 30, 0).getTime());
  });

  it("leaves text that is not a timestamp alone", () => {
    expect(shiftTimestamp("Live")).toBe("Live");
    expect(shiftTimestamp("2026-03")).toBe("2026-03");
  });
});
