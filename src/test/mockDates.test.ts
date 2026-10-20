import { describe, expect, it } from "vitest";
import { MOCK_ANCHOR, daysFromNow, shiftDate, shiftIso } from "@/lib/mockDates";

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
});
