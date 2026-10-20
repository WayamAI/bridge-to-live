import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AUTH_EMAIL_KEY, AUTH_EXPIRES_KEY, AUTH_KEY, SESSION_MS, readSession } from "@/lib/session";

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

/** Writes a valid session, with any field overridden (null removes it). */
const store = (over: Record<string, string | null>) => {
  const values: Record<string, string | null> = {
    [AUTH_KEY]: "true",
    [AUTH_EMAIL_KEY]: "a@b.co",
    [AUTH_EXPIRES_KEY]: String(Date.now() + SESSION_MS - 60_000),
    ...over,
  };
  Object.entries(values).forEach(([k, v]) => (v === null ? window.localStorage.removeItem(k) : window.localStorage.setItem(k, v)));
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
    store({});
    setup();
    expect(screen.getByTestId("state")).toHaveTextContent("in");
  });

  it("logout clears the stored session", () => {
    store({});
    setup();
    act(() => screen.getByText("logout").click());
    expect(window.localStorage.getItem(AUTH_KEY)).toBeNull();
    expect(window.localStorage.getItem(AUTH_EMAIL_KEY)).toBeNull();
    expect(screen.getByTestId("state")).toHaveTextContent("out");
  });

  it("signs this tab out when another tab logs out", () => {
    store({});
    setup();
    expect(screen.getByTestId("state")).toHaveTextContent("in");
    act(() => {
      window.localStorage.removeItem(AUTH_KEY);
      window.dispatchEvent(new StorageEvent("storage", { key: AUTH_KEY }));
    });
    expect(screen.getByTestId("state")).toHaveTextContent("out");
  });

  it("stores an expiry 12 hours after login", () => {
    const before = Date.now();
    setup();
    act(() => screen.getByText("login").click());
    const expires = Number(window.localStorage.getItem(AUTH_EXPIRES_KEY));
    expect(expires).toBeGreaterThanOrEqual(before + SESSION_MS);
    expect(expires).toBeLessThanOrEqual(Date.now() + SESSION_MS);
  });
});

describe("stored session validation", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => vi.useRealTimers());

  it("accepts a valid session", () => {
    store({});
    expect(readSession()?.email).toBe("a@b.co");
  });

  it.each([
    ["the flag is not true", { [AUTH_KEY]: "yes" }],
    ["the flag is missing", { [AUTH_KEY]: null }],
    ["the email is missing", { [AUTH_EMAIL_KEY]: null }],
    ["the email is blank", { [AUTH_EMAIL_KEY]: "   " }],
    ["the expiry is missing (a session from before expiry existed)", { [AUTH_EXPIRES_KEY]: null }],
    ["the expiry is not a number", { [AUTH_EXPIRES_KEY]: "soon" }],
    ["the expiry is negative", { [AUTH_EXPIRES_KEY]: "-5" }],
    ["the expiry is in the past", { [AUTH_EXPIRES_KEY]: String(Date.now() - 1000) }],
    ["the expiry is further away than one session", { [AUTH_EXPIRES_KEY]: String(Date.now() + SESSION_MS * 2) }],
  ])("treats a session as signed out and clears it when %s", (_name, over) => {
    store(over);
    expect(readSession()).toBeNull();
    [AUTH_KEY, AUTH_EMAIL_KEY, AUTH_EXPIRES_KEY].forEach((k) => expect(window.localStorage.getItem(k)).toBeNull());
  });

  it("opens signed out when the stored session is expired or malformed", () => {
    store({ [AUTH_EXPIRES_KEY]: String(Date.now() - 1) });
    setup();
    expect(screen.getByTestId("state")).toHaveTextContent("out");
    expect(window.localStorage.getItem(AUTH_KEY)).toBeNull();
  });

  it("signs out when the session runs out while the page is open", () => {
    vi.useFakeTimers();
    setup();
    act(() => screen.getByText("login").click());
    expect(screen.getByTestId("state")).toHaveTextContent("in");
    act(() => { vi.advanceTimersByTime(SESSION_MS + 1000); });
    expect(screen.getByTestId("state")).toHaveTextContent("out");
    expect(window.localStorage.getItem(AUTH_KEY)).toBeNull();
  });
});
