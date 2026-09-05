"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "portfolio-theme";

/**
 * Pilihan tema, pola yang sama dengan lang-context: localStorage adalah
 * external store, jadi useSyncExternalStore-lah alatnya — bukan setState di
 * dalam effect.
 *
 * Yang benar-benar mewarnai halaman adalah atribut `data-theme` di <html>,
 * dan itu sudah dipasang oleh skrip kecil di <head> sebelum render pertama
 * (lihat layout.tsx). Hook ini hanya menyetir atribut itu, jadi tidak ada
 * kedipan tema salah saat memuat halaman.
 */
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Tab lain yang mengganti tema ikut tersinkron.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readStored(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    // localStorage bisa diblokir (private mode) — anggap belum diset.
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    () => readStored() ?? systemTheme(),
    // Server tidak tahu preferensi apa pun; CSS-lah yang menangani pengunjung
    // pertama kali, jadi nilai server cukup salah satu — ambil terang.
    () => "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // abaikan: pilihan tetap berlaku untuk sesi ini, hanya tidak bertahan.
    }
    emit();
  }, []);

  return {
    theme,
    setTheme,
    toggle: () => setTheme(theme === "dark" ? "light" : "dark"),
  };
}
