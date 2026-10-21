import { describe, expect, it } from "vitest";
import { formatDate, formatKey, formatMonthName, formatMonthYear, formatRupees, formatShortMonth, formatNumber, formatTime, formatYearMonth, yearMonthToTime } from "@/lib/format";

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

  it("formats time as 24-hour HH:mm in IST whatever the viewer zone", () => {
    expect(formatTime(new Date(Date.UTC(2026, 0, 5, 13, 34)))).toBe("19:04");
    expect(formatTime(new Date(Date.UTC(2026, 0, 5, 18, 30)))).toBe("00:00");
    expect(formatTime(new Date(Date.UTC(2026, 0, 5, 1, 5)))).toBe("06:35");
  });

  it("keeps short month names", () => {
    expect(formatMonthName(new Date(2026, 3, 1))).toBe("Apr");
  });

  it("turns every underscore in a key into a space", () => {
    expect(formatKey("rate_of_change")).toBe("rate of change");
    expect(formatKey("anomaly")).toBe("anomaly");
  });

  it("turns a year-month into a chart time and back to a short label", () => {
    expect(yearMonthToTime("2024-04")).toBe(Date.UTC(2024, 3, 1));
    expect(yearMonthToTime("2024-13")).toBeNaN();
    expect(yearMonthToTime("soon")).toBeNaN();
    expect(formatMonthYear(yearMonthToTime("2024-04"))).toBe("Apr 24");
  });

  it("writes rupee amounts in lakh and crore one way", () => {
    expect(formatRupees(42)).toBe("₹42 L");
    expect(formatRupees(976)).toBe("₹9.76 Cr");
    expect(formatRupees(874)).toBe("₹8.74 Cr");
    expect(formatRupees(0.9)).toBe("₹0.9 L");
    expect(formatRupees(99.99)).toBe("₹99.99 L");
    expect(formatRupees(100)).toBe("₹1.00 Cr");
    expect(formatRupees(-98)).toBe("−₹98 L");
    expect(formatRupees(98, { signed: true })).toBe("+₹98 L");
    expect(formatRupees(0, { signed: true })).toBe("₹0 L");
    expect(formatRupees(118, { per: "yr" })).toBe("₹1.18 Cr/yr");
    expect(formatRupees(-1139, { signed: true, per: "yr" })).toBe("−₹11.39 Cr/yr");
  });

  it("writes a short month with a two-digit year", () => {
    expect(formatShortMonth(new Date(2025, 9, 1))).toBe("Oct '25");
    expect(formatShortMonth(new Date(2026, 0, 31))).toBe("Jan '26");
  });
});
