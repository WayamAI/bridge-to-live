import { describe, expect, it } from "vitest";
import { formatDate, formatMonthName, formatNumber, formatTime, formatYearMonth } from "@/lib/format";

describe("format", () => {
  it("groups numbers the en-IN way and keeps the default precision", () => {
    expect(formatNumber(1234567)).toBe("12,34,567");
    expect(formatNumber(1234.56789)).toBe("1,234.568");
    expect(formatNumber(999)).toBe("999");
  });

  it("formats dates as ISO YYYY-MM-DD in local time", () => {
    expect(formatDate(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
    expect(formatYearMonth(new Date(2025, 4, 1))).toBe("2025-05");
  });

  it("formats time as 24-hour HH:mm", () => {
    expect(formatTime(new Date(2026, 0, 5, 7, 4))).toBe("07:04");
    expect(formatTime(new Date(2026, 0, 5, 19, 30))).toBe("19:30");
  });

  it("keeps short month names", () => {
    expect(formatMonthName(new Date(2026, 3, 1))).toBe("Apr");
  });
});
