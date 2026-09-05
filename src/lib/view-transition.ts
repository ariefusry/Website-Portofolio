type WithViewTransition = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

/**
 * Jalankan perubahan DOM di dalam View Transition kalau browsernya mendukung.
 *
 * Dipakai bersama oleh pergantian tema dan pergantian bahasa. Keduanya
 * mengubah hampir seluruh halaman sekaligus, dan mentransisikan tiap elemen
 * satu per satu terukur patah-patah (frame terburuk 109ms); View Transition
 * memudarkan dua cuplikan di GPU, jadi biayanya tidak bergantung pada jumlah
 * elemen.
 *
 * Tanpa dukungan API-nya — atau saat pengguna minta gerakan dikurangi —
 * perubahannya diterapkan seketika.
 */
export function withViewTransition(apply: () => void) {
  const doc = document as WithViewTransition;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || typeof doc.startViewTransition !== "function") {
    apply();
    return;
  }

  doc.startViewTransition(apply);
}
