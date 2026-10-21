import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AUTH_EMAIL_KEY, AUTH_EXPIRES_KEY, AUTH_KEY, LOGOUT_SIGNAL_KEY, SESSION_MS, readSession } from "@/lib/session";

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
  Object.entries(values).forEach(([k, v]) => (v === null ? window.sessionStorage.removeItem(k) : window.sessionStorage.setItem(k, v)));
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
  beforeEach(() => window.sessionStorage.clear());

  it("stores the session in sessionStorage (this tab only) under the existing keys", () => {
    setup();
    act(() => screen.getByText("login").click());
    expect(window.sessionStorage.getItem(AUTH_KEY)).toBe("true");
    expect(window.sessionStorage.getItem(AUTH_EMAIL_KEY)).toBe("a@b.co");
    expect(screen.getByTestId("state")).toHaveTextContent("in");
  });

  it("starts signed in when a session is already stored (a refresh of this tab)", () => {
    store({});
    setup();
    expect(screen.getByTestId("state")).toHaveTextContent("in");
  });

  it("logout clears the stored session", () => {
    store({});
    setup();
    act(() => screen.getByText("logout").click());
    expect(window.sessionStorage.getItem(AUTH_KEY)).toBeNull();
    expect(window.sessionStorage.getItem(AUTH_EMAIL_KEY)).toBeNull();
    expect(screen.getByTestId("state")).toHaveTextContent("out");
  });

  it("never writes the session to localStorage", () => {
    setup();
    act(() => screen.getByText("login").click());
    [AUTH_KEY, AUTH_EMAIL_KEY, AUTH_EXPIRES_KEY].forEach((k) => expect(window.localStorage.getItem(k)).toBeNull());
  });

  it("removes an old localStorage session on load and does not use it", () => {
    window.localStorage.setItem(AUTH_KEY, "true");
    window.localStorage.setItem(AUTH_EMAIL_KEY, "a@b.co");
    window.localStorage.setItem(AUTH_EXPIRES_KEY, String(Date.now() + SESSION_MS - 60_000));
    setup();
    expect(screen.getByTestId("state")).toHaveTextContent("out");
    [AUTH_KEY, AUTH_EMAIL_KEY, AUTH_EXPIRES_KEY].forEach((k) => expect(window.localStorage.getItem(k)).toBeNull());
  });

  it("signs this tab out when another tab logs out (broadcast message)", () => {
    const channels: { onmessage: ((e: { data: string }) => void) | null }[] = [];
    class FakeChannel {
      onmessage: ((e: { data: string }) => void) | null = null;
      constructor() { channels.push(this); }
      postMessage() {}
      close() { const i = channels.indexOf(this); if (i >= 0) channels.splice(i, 1); }
    }
    vi.stubGlobal("BroadcastChannel", FakeChannel);
    try {
      store({});
      setup();
      expect(screen.getByTestId("state")).toHaveTextContent("in");
      act(() => channels.forEach((c) => c.onmessage?.({ data: "logout" })));
      expect(screen.getByTestId("state")).toHaveTextContent("out");
      expect(window.sessionStorage.getItem(AUTH_KEY)).toBeNull();
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("signs this tab out on the storage-event fallback when BroadcastChannel is missing", () => {
    vi.stubGlobal("BroadcastChannel", undefined);
    try {
      store({});
      setup();
      act(() => { window.dispatchEvent(new StorageEvent("storage", { key: LOGOUT_SIGNAL_KEY })); });
      expect(screen.getByTestId("state")).toHaveTextContent("out");
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("stores an expiry 12 hours after login", () => {
    const before = Date.now();
    setup();
    act(() => screen.getByText("login").click());
    const expires = Number(window.sessionStorage.getItem(AUTH_EXPIRES_KEY));
    expect(expires).toBeGreaterThanOrEqual(before + SESSION_MS);
    expect(expires).toBeLessThanOrEqual(Date.now() + SESSION_MS);
  });
});

describe("stored session validation", () => {
  beforeEach(() => window.sessionStorage.clear());
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
    [AUTH_KEY, AUTH_EMAIL_KEY, AUTH_EXPIRES_KEY].forEach((k) => expect(window.sessionStorage.getItem(k)).toBeNull());
  });

  it("opens signed out when the stored session is expired or malformed", () => {
    store({ [AUTH_EXPIRES_KEY]: String(Date.now() - 1) });
    setup();
    expect(screen.getByTestId("state")).toHaveTextContent("out");
    expect(window.sessionStorage.getItem(AUTH_KEY)).toBeNull();
  });

  it("signs out when the session runs out while the page is open", () => {
    vi.useFakeTimers();
    setup();
    act(() => screen.getByText("login").click());
    expect(screen.getByTestId("state")).toHaveTextContent("in");
    act(() => { vi.advanceTimersByTime(SESSION_MS + 1000); });
    expect(screen.getByTestId("state")).toHaveTextContent("out");
    expect(window.sessionStorage.getItem(AUTH_KEY)).toBeNull();
  });
});
