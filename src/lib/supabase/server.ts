import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createPlainClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Klien server yang terikat cookie sesi — dipakai route admin dan Server Actions.
 * Harus dipanggil dari konteks request (bukan dari render yang di-cache statis).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Dipanggil dari Server Component: penulisan cookie ditangani middleware.
        }
      },
    },
  });
}

/**
 * Klien anonim tanpa cookie — untuk membaca konten publik di halaman ter-cache.
 * Tidak menyentuh `cookies()`, jadi halaman tetap bisa di-ISR.
 */
export function createPublicClient() {
  return createPlainClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
