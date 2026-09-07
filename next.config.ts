import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/**
 * Supabase Storage melayani aset dari `<project>.supabase.co/storage/v1/object/public/...`.
 * Host-nya diturunkan dari env supaya tidak perlu di-hardcode per project.
 */
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

let isDev = false;
const supabaseOrigin = supabaseHost ? `https://${supabaseHost}` : "";
const supabaseSocket = supabaseHost ? `wss://${supabaseHost}` : "";

/** Skrip Vercel Web Analytics; beacon-nya sendiri pergi ke /_vercel/insights (satu origin). */
const VERCEL_ANALYTICS = "https://va.vercel-scripts.com";

/** hCaptcha di halaman login memuat skrip, iframe, dan style dari domainnya sendiri. */
const HCAPTCHA = "https://hcaptcha.com https://*.hcaptcha.com";

/**
 * Content-Security-Policy.
 *
 * `'unsafe-inline'` pada script-src masih diperlukan: skrip tema di <head>
 * (layout.tsx) dan blok JSON-LD (page.tsx) keduanya inline, dan keduanya
 * berisi string yang kita susun sendiri — bukan input pengunjung.
 * Menggantinya dengan nonce menuntut setiap halaman dirender dinamis,
 * yang membatalkan ISR yang dipakai situs ini.
 */
const buildCsp = () => [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${HCAPTCHA} ${VERCEL_ANALYTICS}${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline' ${HCAPTCHA}`,
  `img-src 'self' data: blob: ${supabaseOrigin}`.trim(),
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseOrigin} ${supabaseSocket} ${HCAPTCHA}${isDev ? " ws: http://localhost:*" : ""}`.trim(),
  `frame-src ${HCAPTCHA}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
]
  .join("; ")
  .replace(/\s+/g, " ");

const buildConfig = (): NextConfig => ({
  poweredByHeader: false,

  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: buildCsp() },
          // Paksa HTTPS selama dua tahun, termasuk subdomain.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        // Halaman admin tidak boleh tersimpan di cache bersama mana pun.
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
});

/**
 * Bentuk fungsi dipakai supaya fase benar-benar diketahui. `process.env.NODE_ENV`
 * tidak bisa dipercaya di sini: saat next.config dievaluasi nilainya belum tentu
 * "production", sehingga CSP produksi ikut membawa `unsafe-eval` milik dev.
 */
const config = (phase: string): NextConfig => {
  isDev = phase === PHASE_DEVELOPMENT_SERVER;
  return buildConfig();
};

export default config;
