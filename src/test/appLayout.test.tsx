import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AppLayout from "@/components/layout/AppLayout";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";

const setup = () =>
  render(
    <ThemeProvider>
      <AuthProvider>
        <MemoryRouter>
          <Routes>
            <Route element={<AppLayout alerts={[]} userRole="plant_director" onRoleChange={() => {}} />}>
              <Route path="*" element={<p>page</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </ThemeProvider>,
  );

describe("mobile navigation drawer", () => {
  it("opens from the menu button and closes on Escape", () => {
    setup();
    expect(screen.queryByRole("button", { name: "Close navigation" })).toBeNull();
    act(() => screen.getByRole("button", { name: "Open navigation" }).click());
    expect(screen.getByRole("button", { name: "Close navigation" })).toBeInTheDocument();
    act(() => { window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })); });
    expect(screen.queryByRole("button", { name: "Close navigation" })).toBeNull();
  });

  it("ignores other keys", () => {
    setup();
    act(() => screen.getByRole("button", { name: "Open navigation" }).click());
    act(() => { window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" })); });
    expect(screen.getByRole("button", { name: "Close navigation" })).toBeInTheDocument();
  });
});
