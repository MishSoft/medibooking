import type { AuthUser } from "./auth.api";

const TOKEN_KEY = "medibooking.token";
const USER_KEY = "medibooking.user";

// localStorage can throw (private mode, blocked storage) — fail soft
const safeStorage = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

export const authStorage = {
  getToken: () => safeStorage.get(TOKEN_KEY),

  getUser: (): AuthUser | null => {
    const raw = safeStorage.get(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  setSession: (token: string, user: AuthUser) => {
    safeStorage.set(TOKEN_KEY, token);
    safeStorage.set(USER_KEY, JSON.stringify(user));
  },

  clear: () => {
    safeStorage.remove(TOKEN_KEY);
    safeStorage.remove(USER_KEY);
  },
};
