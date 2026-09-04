import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Menyegarkan cookie sesi Supabase dan menjaga /admin.
 * Pemeriksaan keanggotaan admin (bukan sekadar "sudah login") dilakukan lagi
 * di app/admin/(dash)/layout.tsx dan ditegakkan oleh RLS di database.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Supabase belum dikonfigurasi: /admin tidak bisa dipakai, arahkan ke beranda.
    if (request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return response;
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /**
   * getUser() di atas bisa merotasi refresh token dan menulis cookie baru ke
   * `response`. Membuat response redirect yang baru akan membuang cookie itu,
   * sehingga token lama yang sudah terpakai jadi satu-satunya yang dikirim
   * browser — sesi lalu putus di request berikutnya. Jadi cookie apa pun yang
   * sempat ditulis harus ikut dibawa ke response redirect.
   */
  const redirectTo = (url: URL) => {
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (pathname.startsWith("/admin") && !isLoginPage && !user) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname);
    return redirectTo(url);
  }

  if (isLoginPage && user) {
    return redirectTo(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
