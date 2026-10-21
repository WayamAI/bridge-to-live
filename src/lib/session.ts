// Demo session storage: validation, expiry and storage-failure handling. Used by hooks/useAuth.
// The session lives in sessionStorage: one tab keeps it across refreshes, a new tab, a closed tab or a reopened browser starts signed out.

export const AUTH_KEY = "wayam-auth";
export const AUTH_EMAIL_KEY = "wayam-auth-email";
export const AUTH_EXPIRES_KEY = "wayam-auth-expires";
/** A demo session lasts 12 hours from login. */
export const SESSION_MS = 12 * 60 * 60 * 1000;

/** Sessions used to live in localStorage (shared by every tab, kept for 12 hours). Remove those keys so they cannot linger. */
export function purgeLegacySession() {
  try {
    [AUTH_KEY, AUTH_EMAIL_KEY, AUTH_EXPIRES_KEY].forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* nothing stored that we can reach */
  }
}

export function clearStored() {
  try {
    window.sessionStorage.removeItem(AUTH_KEY);
    window.sessionStorage.removeItem(AUTH_EMAIL_KEY);
    window.sessionStorage.removeItem(AUTH_EXPIRES_KEY);
  } catch {
    /* nothing stored that we can reach */
  }
}

/**
 * The stored session, or null. It is accepted only with the expected shape: the flag "true", a non-empty email and an
 * expiry time that is a number, still in the future and no more than one session length away. Anything else (malformed,
 * expired, or from before expiry existed) counts as signed out and is cleared.
 * Storage can throw (private window, blocked site data); then there is no stored session and a login lasts for this
 * page load only.
 */
export function readSession(now = Date.now()): { email: string; expiresAt: number } | null {
  try {
    const flag = window.sessionStorage.getItem(AUTH_KEY);
    const email = window.sessionStorage.getItem(AUTH_EMAIL_KEY);
    const rawExpires = window.sessionStorage.getItem(AUTH_EXPIRES_KEY);
    if (flag === null && email === null && rawExpires === null) return null;
    const expiresAt = rawExpires !== null && /^\d{1,16}$/.test(rawExpires) ? Number(rawExpires) : NaN;
    const valid =
      flag === "true" &&
      typeof email === "string" && email.trim().length > 0 && email.length <= 254 &&
      Number.isFinite(expiresAt) && expiresAt > now && expiresAt <= now + SESSION_MS;
    if (!valid) {
      clearStored();
      return null;
    }
    return { email: email as string, expiresAt };
  } catch {
    return null;
  }
}

export function writeSession(email: string, expiresAt: number) {
  try {
    window.sessionStorage.setItem(AUTH_KEY, "true");
    window.sessionStorage.setItem(AUTH_EMAIL_KEY, email);
    window.sessionStorage.setItem(AUTH_EXPIRES_KEY, String(expiresAt));
  } catch {
    /* keep the in-memory state only */
  }
}

const LOGOUT_CHANNEL = "wayam-auth";
/** Fallback for browsers without BroadcastChannel: a storage event in the other tabs. Holds no session data. */
export const LOGOUT_SIGNAL_KEY = "wayam-logout";

/** Tell the other open tabs to sign out (each tab has its own session, so there is nothing shared to clear). */
export function announceLogout() {
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const ch = new BroadcastChannel(LOGOUT_CHANNEL);
      ch.postMessage("logout");
      ch.close();
      return;
    }
    window.localStorage.setItem(LOGOUT_SIGNAL_KEY, String(Date.now()));
  } catch {
    /* other tabs stay signed in until they expire */
  }
}

/** Calls `onLogout` when another tab logs out. Returns the unsubscribe function. */
export function listenForLogout(onLogout: () => void): () => void {
  let channel: BroadcastChannel | undefined;
  const onStorage = (e: StorageEvent) => { if (e.key === LOGOUT_SIGNAL_KEY) onLogout(); };
  try {
    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel(LOGOUT_CHANNEL);
      channel.onmessage = (e) => { if (e.data === "logout") onLogout(); };
    }
  } catch {
    channel = undefined;
  }
  if (!channel) window.addEventListener("storage", onStorage);
  return () => {
    channel?.close();
    window.removeEventListener("storage", onStorage);
  };
}
