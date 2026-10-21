import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import SettingsPage from "@/pages/SettingsPage";
import { Toaster, toast } from "@/components/ui/sonner";
import { ThemeProvider } from "@/hooks/useTheme";

describe("Settings thresholds", () => {
  it("keep typed values while switching tabs", () => {
    render(<MemoryRouter><SettingsPage /></MemoryRouter>);
    const field = () => screen.getByLabelText("COMP-* Vibration (DE) high alarm") as HTMLInputElement;
    expect(field().value).toBe("4.5");
    fireEvent.change(field(), { target: { value: "4.9" } });
    fireEvent.click(screen.getByRole("button", { name: /Alert configuration/ }));
    expect(screen.queryByLabelText("COMP-* Vibration (DE) high alarm")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Sensor thresholds/ }));
    expect(field().value).toBe("4.9");
  });
});

describe("Toaster theme", () => {
  afterEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it.each(["light", "dark"])("follows the app theme (%s)", async (theme) => {
    window.localStorage.setItem("wayam-theme", theme);
    render(<ThemeProvider><Toaster /></ThemeProvider>);
    act(() => { toast("Saved"); });
    await waitFor(() => expect(document.querySelector("[data-sonner-toaster]")?.getAttribute("data-theme")).toBe(theme));
  });
});
