"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { Bi, Lang } from "./types";
import { pick } from "./i18n";
import { withViewTransition } from "./view-transition";

const STORAGE_KEY = "portfolio-lang";

/**
 * Pilihan bahasa hidup di localStorage, bukan di state React — localStorage
 * adalah external store, jadi useSyncExternalStore-lah alatnya. Ini juga
 * menghindari setState di dalam effect (yang memicu cascading render) dan
 * membuat SSR tetap cocok: server memakai defaultLang, klien membaca simpanan.
 */
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Tab lain yang mengubah bahasa ikut tersinkron.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readStored(): Lang | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "EN" || stored === "ID" ? stored : null;
  } catch {
    // localStorage bisa diblokir (private mode) — perlakukan sebagai belum diset.
    return null;
  }
}

function writeStored(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // abaikan: pilihan tetap berlaku untuk sesi ini, hanya tidak bertahan.
  }
  // Ganti bahasa menukar hampir semua teks di halaman sekaligus. Dipudarkan
  // lewat mekanisme yang sama dengan pergantian tema, supaya tidak berkedip.
  withViewTransition(emit);
}

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  /** Shortcut: t(bilingualValue) → string bahasa aktif. */
  t: (value: Bi) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({
  defaultLang,
  children,
}: {
  defaultLang: Lang;
  children: React.ReactNode;
}) {
  const lang = useSyncExternalStore(
    subscribe,
    () => readStored() ?? defaultLang,
    () => defaultLang,
  );

  useEffect(() => {
    document.documentElement.lang = lang === "ID" ? "id" : "en";
  }, [lang]);

  const setLang = useCallback((next: Lang) => writeStored(next), []);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang,
      toggle: () => setLang(lang === "EN" ? "ID" : "EN"),
      t: (v: Bi) => pick(v, lang),
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}
