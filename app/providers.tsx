"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import type { User } from "./data/types";

const STORAGE_KEY = "av_user";
const listeners = new Set<() => void>();

function readUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function getServerUser(): User | null {
  return null;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function writeUser(user: User | null) {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable — session stays in-memory only
  }
  for (const listener of listeners) listener();
}

type UserContextValue = {
  user: User | null;
  login: (user: User | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, readUser, getServerUser);

  const login = useCallback((nextUser: User | null) => writeUser(nextUser), []);
  const logout = useCallback(() => writeUser(null), []);

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
