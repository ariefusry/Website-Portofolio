"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/env";
import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";

/** Satu kunjungan per browser per hari; kunjungan berikutnya hanya membaca. */
const STORAGE_KEY = "portfolio-visit";

/**
 * Jumlah kunjungan di footer.
 *
 * Angkanya hidup di Supabase dan dinaikkan lewat RPC `register_visit()`, bukan
 * `update` langsung: tabelnya read-only dari klien, jadi nilainya tidak bisa
 * ditulis sembarangan — hanya bertambah satu per panggilan.
 *
 * Ini penghitung sederhana, bukan analitik. Satu orang yang membuka situs dari
 * dua browser terhitung dua kali, dan crawler yang menjalankan JavaScript ikut
 * terhitung. Untuk angka yang bisa dipertanggungjawabkan, pakai Vercel Analytics.
 */
export function VisitorCount() {
  const { t, lang } = useLang();
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    if (!supabaseConfigured) return;

    let cancelled = false;
    const supabase = createClient();

    // Kunci harian: hari ini dalam waktu lokal pengunjung, bukan UTC.
    const today = new Date().toLocaleDateString("en-CA");

    let seenToday = false;
    try {
      seenToday = localStorage.getItem(STORAGE_KEY) === today;
    } catch {
      // Mode privat / cookie diblokir: hitung saja, jangan sampai gagal render.
    }

    (async () => {
      if (seenToday) {
        const { data } = await supabase
          .from("site_metrics")
          .select("visits")
          .eq("id", 1)
          .maybeSingle();
        if (!cancelled && data) setVisits(Number(data.visits));
        return;
      }

      const { data, error } = await supabase.rpc("register_visit");
      if (cancelled || error) return;

      setVisits(Number(data));
      try {
        localStorage.setItem(STORAGE_KEY, today);
      } catch {
        // Tidak bisa disimpan berarti kunjungan berikutnya terhitung lagi.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Sebelum angkanya tiba, tidak ada yang dirender — lebih baik daripada
  // menampilkan "0" lalu melompat ke angka sebenarnya.
  if (visits === null) return null;

  return (
    <p className="m-0 pt-2 font-mono text-xs leading-none text-dark-2/70">
      {visits.toLocaleString(lang === "ID" ? "id-ID" : "en-US")}{" "}
      {t(UI.visits)}
    </p>
  );
}
