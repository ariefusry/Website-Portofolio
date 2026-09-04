"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Bi, Lang } from "./types";
import { pick } from "./i18n";

const STORAGE_KEY = "portfolio-lang";

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
  // Render pertama selalu memakai defaultLang dari server; localStorage dibaca
  // setelah mount supaya markup server dan client cocok (tanpa hydration mismatch).
  const [lang, setLangState] = useState<Lang>(defaultLang);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "EN" || stored === "ID") setLangState(stored);
    } catch {
      // localStorage bisa diblokir (private mode) — abaikan, pakai default.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "ID" ? "id" : "en";
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // abaikan
    }
  }, []);

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
