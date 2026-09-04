import { SEED } from "./seed";
import type { Content } from "./types";
import { fetchContentFromSupabase } from "./supabase/content";

/**
 * Sumber konten halaman publik.
 *
 * Supabase adalah sumber utama, tapi tidak pernah jadi titik gagal tunggal:
 * kalau env belum diisi atau query error, halaman tetap render penuh dari SEED.
 */
export async function getContent(): Promise<Content> {
  try {
    const fromDb = await fetchContentFromSupabase();
    return fromDb ?? SEED;
  } catch (error) {
    console.error("[content] gagal memuat dari Supabase, memakai seed:", error);
    return SEED;
  }
}
