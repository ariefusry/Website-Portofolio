"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }

    router.replace(params.get("next") ?? "/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm rounded-xl border border-[var(--color-line)] bg-white p-8"
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

      {error ? (
        <p className="mt-0 mb-4 rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-ink px-4 py-3 font-display text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Memproses…" : "Masuk"}
      </button>
    </form>
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
