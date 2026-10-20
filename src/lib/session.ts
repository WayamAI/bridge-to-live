// Demo session storage: validation, expiry and storage-failure handling. Used by hooks/useAuth.

export const AUTH_KEY = "wayam-auth";
export const AUTH_EMAIL_KEY = "wayam-auth-email";
export const AUTH_EXPIRES_KEY = "wayam-auth-expires";
/** A demo session lasts 12 hours from login. */
export const SESSION_MS = 12 * 60 * 60 * 1000;

export function clearStored() {
  try {
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(AUTH_EMAIL_KEY);
    window.localStorage.removeItem(AUTH_EXPIRES_KEY);
  } catch {
    /* nothing stored that we can reach */
  }
}

/**
 * The stored session, or null. It is accepted only with the expected shape: the flag "true", a non-empty email and an
 * expiry time that is a number, still in the future and no more than one session length away. Anything else (malformed,
 * expired, or from before expiry existed) counts as signed out and is cleared.
 * The session lives in localStorage so every tab shares it and a logout in one tab signs out all of them. Storage can
 * throw (private window, blocked site data); then there is no stored session and a login lasts for this page load only.
 */
export function readSession(now = Date.now()): { email: string; expiresAt: number } | null {
  try {
    const flag = window.localStorage.getItem(AUTH_KEY);
    const email = window.localStorage.getItem(AUTH_EMAIL_KEY);
    const rawExpires = window.localStorage.getItem(AUTH_EXPIRES_KEY);
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
    window.localStorage.setItem(AUTH_KEY, "true");
    window.localStorage.setItem(AUTH_EMAIL_KEY, email);
    window.localStorage.setItem(AUTH_EXPIRES_KEY, String(expiresAt));
  } catch {
    /* keep the in-memory state only */
  }
}
