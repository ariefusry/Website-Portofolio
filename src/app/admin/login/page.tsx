"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const HCAPTCHA_SITEKEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY ?? "";

/**
 * API hCaptcha yang dipasang oleh skrip eksternal. Hanya bagian yang dipakai
 * di sini yang dideklarasikan.
 */
type HCaptcha = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window {
    hcaptcha?: HCaptcha;
  }
}

/**
 * `next` datang dari URL, jadi tidak boleh dipercaya: hanya path internal di
 * bawah /admin yang diterima. Tanpa ini, /admin/login?next=https://… akan
 * melempar admin ke situs lain tepat setelah dia berhasil masuk.
 */
function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/admin";
  return value.startsWith("/admin") ? value : "/admin";
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const captchaBox = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  /**
   * Attack Protection di Supabase menolak setiap request auth tanpa token
   * captcha, jadi widget ini bukan hiasan: tanpa token, login pasti gagal.
   */
  const mountCaptcha = useCallback(() => {
    if (!HCAPTCHA_SITEKEY || !window.hcaptcha) return;
    if (!captchaBox.current || widgetId.current !== null) return;

    widgetId.current = window.hcaptcha.render(captchaBox.current, {
      sitekey: HCAPTCHA_SITEKEY,
      callback: (token) => setCaptchaToken(token),
      "expired-callback": () => setCaptchaToken(null),
      "error-callback": () => setCaptchaToken(null),
    });
  }, []);

  useEffect(() => {
    if (scriptReady) mountCaptcha();
  }, [scriptReady, mountCaptcha]);

  function resetCaptcha() {
    setCaptchaToken(null);
    if (window.hcaptcha && widgetId.current !== null) {
      window.hcaptcha.reset(widgetId.current);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (HCAPTCHA_SITEKEY && !captchaToken) {
      setError("Selesaikan verifikasi captcha dulu.");
      return;
    }

    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      ...(captchaToken ? { options: { captchaToken } } : {}),
    });

    if (error) {
      setError(error.message);
      // Token hCaptcha sekali pakai — percobaan berikutnya butuh yang baru.
      resetCaptcha();
      setBusy(false);
      return;
    }

    router.replace(safeNext(params.get("next")));
    router.refresh();
  }

  return (
    <>
      {HCAPTCHA_SITEKEY ? (
        <Script
          src="https://js.hcaptcha.com/1/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
        />
      ) : null}

      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl border border-[var(--color-line)] bg-surface p-8"
      >
        <h1 className="mt-0 mb-1 font-display text-2xl font-semibold">Admin</h1>
        <p className="mt-0 mb-6 font-body text-sm text-muted">
          Masuk untuk mengelola konten portofolio.
        </p>

        <label className="mb-4 block font-body text-sm font-medium">
          Email
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[var(--color-line-strong)] px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
        </label>

        <label className="mb-6 block font-body text-sm font-medium">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[var(--color-line-strong)] px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
        </label>

        {HCAPTCHA_SITEKEY ? (
          <div ref={captchaBox} className="mb-6 flex justify-center" />
        ) : (
          <p className="mt-0 mb-6 rounded-lg bg-amber-50 px-3 py-2 font-body text-xs text-amber-800">
            NEXT_PUBLIC_HCAPTCHA_SITEKEY belum diisi. Selama Attack Protection
            aktif di Supabase, login akan ditolak.
          </p>
        )}

        {error ? (
          <p className="mt-0 mb-4 rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-ink px-4 py-3 font-display text-sm font-semibold text-on-ink disabled:opacity-60"
        >
          {busy ? "Memproses…" : "Masuk"}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
