"use client";

import { useCallback, useSyncExternalStore } from "react";

/** One key per thing we persist, kept in one place to avoid typos. */
export const STORAGE_KEYS = {
  jobs: "hrms.jobs",
  applications: "hrms.applications",
  savedJobs: "hrms.savedJobs",
  profile: "hrms.profile",
  session: "hrms.session",
} as const;

/** Read and parse a value. Returns null if it is missing or unreadable. */
export function readJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

/** Save a value. Quietly does nothing if localStorage is unavailable. */
export function writeJSON(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing or a full quota - not worth breaking the page over.
  }
}

/**
 * A tiny shared store, one per storage key.
 *
 * Why not plain useState? Because several components read the same data at
 * once - the saved-jobs page and the bookmark button inside each job card, for
 * example. With useState each of them would get its own separate copy and they
 * would drift apart. Keeping one value per key means every component that
 * reads it re-renders together.
 */
interface Store<T> {
  /** The value the server rendered with, so hydration always matches. */
  initial: T;
  value: T;
  listeners: Set<() => void>;
}

const stores = new Map<string, Store<unknown>>();

function getStore<T>(key: string, initial: T): Store<T> {
  dropStaleData();

  let store = stores.get(key) as Store<T> | undefined;

  if (!store) {
    // First time this key is used: start from localStorage, or the seed data.
    store = { initial, value: readJSON<T>(key) ?? initial, listeners: new Set() };
    stores.set(key, store as Store<unknown>);
  }

  return store;
}

/**
 * Every key holding sample data.
 *
 * Saved jobs and profiles are stored per user ("hrms.profile.cand-001"), so we
 * match on the prefix rather than an exact name. The session and the version
 * marker are deliberately left alone - resetting the data should not sign you
 * out of the dashboard you are looking at.
 */
function demoDataKeys(): string[] {
  const keep = new Set<string>([STORAGE_KEYS.session, VERSION_KEY]);
  return Object.keys(window.localStorage).filter(
    (key) => key.startsWith("hrms.") && !keep.has(key),
  );
}

/** Put the original sample data back. Used by the "Reset demo data" button. */
export function clearDemoData(): void {
  if (typeof window === "undefined") return;
  demoDataKeys().forEach((key) => {
    window.localStorage.removeItem(key);
    stores.delete(key);
  });
  window.localStorage.setItem(VERSION_KEY, DATA_VERSION);
}

/**
 * Bump this whenever the seed data in lib/jobs.ts, lib/applications.ts or
 * lib/candidates.ts changes shape or content.
 *
 * Without it, anyone who opened the site before the change would keep seeing
 * their old saved copy forever, because localStorage always wins over the seed.
 */
const DATA_VERSION = "3";
const VERSION_KEY = "hrms.version";

let versionChecked = false;

/** Drops saved data that was written by an older version of the seed data. */
function dropStaleData(): void {
  if (versionChecked || typeof window === "undefined") return;
  versionChecked = true;

  try {
    if (window.localStorage.getItem(VERSION_KEY) === DATA_VERSION) return;
    demoDataKeys().forEach((key) => window.localStorage.removeItem(key));
    window.localStorage.setItem(VERSION_KEY, DATA_VERSION);
  } catch {
    // localStorage unavailable - nothing to clean up.
  }
}

const noopSubscribe = () => () => {};
const clientTrue = () => true;
const serverFalse = () => false;

/**
 * False while the server-rendered HTML is being hydrated, true afterwards.
 * Handy for showing a "Loading…" message instead of briefly rendering the
 * seed data before the saved data is read.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, clientTrue, serverFalse);
}

type SetValue<T> = (next: T | ((current: T) => T)) => void;

/**
 * Like useState, but the value is shared between components and saved to
 * localStorage.
 *
 * `initialValue` should be a constant defined outside the component (the seed
 * arrays in lib/jobs.ts, for instance) so its identity does not change between
 * renders.
 */
export function useLocalStorageState<T>(key: string, initialValue: T) {
  const subscribe = useCallback(
    (listener: () => void) => {
      const store = getStore(key, initialValue);
      store.listeners.add(listener);
      return () => {
        store.listeners.delete(listener);
      };
    },
    [key, initialValue],
  );

  const getSnapshot = useCallback(() => getStore(key, initialValue).value, [key, initialValue]);

  // React renders with this on the server and during hydration, so the first
  // browser render matches the HTML exactly.
  const getServerSnapshot = useCallback(
    () => getStore(key, initialValue).initial,
    [key, initialValue],
  );

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback<SetValue<T>>(
    (next) => {
      const store = getStore(key, initialValue);
      const resolved =
        typeof next === "function" ? (next as (current: T) => T)(store.value) : next;

      store.value = resolved;
      writeJSON(key, resolved);
      // Tell every component using this key to re-render.
      store.listeners.forEach((listener) => listener());
    },
    [key, initialValue],
  );

  const hydrated = useHydrated();

  return [value, setValue, hydrated] as const;
}
