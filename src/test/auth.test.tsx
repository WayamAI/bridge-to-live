import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthProvider, AUTH_EMAIL_KEY, AUTH_KEY, useAuth } from "@/hooks/useAuth";

const Probe = () => {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <>
      <span data-testid="state">{isAuthenticated ? "in" : "out"}</span>
      <button onClick={() => login("a@b.co")}>login</button>
      <button onClick={logout}>logout</button>
    </>
  );
};

const setup = () =>
  render(
    <MemoryRouter>
      <Routes>
        <Route path="*" element={<AuthProvider><Probe /></AuthProvider>} />
      </Routes>
    </MemoryRouter>,
  );

describe("auth session", () => {
  beforeEach(() => window.localStorage.clear());

  it("stores the session in localStorage under the existing keys", () => {
    setup();
    act(() => screen.getByText("login").click());
    expect(window.localStorage.getItem(AUTH_KEY)).toBe("true");
    expect(window.localStorage.getItem(AUTH_EMAIL_KEY)).toBe("a@b.co");
    expect(screen.getByTestId("state")).toHaveTextContent("in");
  });

  it("starts signed in when a session is already stored (another tab, or a refresh)", () => {
    window.localStorage.setItem(AUTH_KEY, "true");
    setup();
    expect(screen.getByTestId("state")).toHaveTextContent("in");
  });

  it("logout clears the stored session", () => {
    window.localStorage.setItem(AUTH_KEY, "true");
    setup();
    act(() => screen.getByText("logout").click());
    expect(window.localStorage.getItem(AUTH_KEY)).toBeNull();
    expect(window.localStorage.getItem(AUTH_EMAIL_KEY)).toBeNull();
    expect(screen.getByTestId("state")).toHaveTextContent("out");
  });

  it("signs this tab out when another tab logs out", () => {
    window.localStorage.setItem(AUTH_KEY, "true");
    setup();
    expect(screen.getByTestId("state")).toHaveTextContent("in");
    act(() => {
      window.localStorage.removeItem(AUTH_KEY);
      window.dispatchEvent(new StorageEvent("storage", { key: AUTH_KEY }));
    });
    expect(screen.getByTestId("state")).toHaveTextContent("out");
  });
});
