"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Batas error untuk seluruh situs. LangProvider dipasang per halaman, jadi di
 * sini belum tersedia — teksnya ditulis dalam dua bahasa sekaligus.
 */
export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="section-x section-inner flex min-h-[60vh] flex-col items-start justify-center gap-4 py-16">
      <h1 className="m-0 font-display text-[clamp(26px,5vw,36px)] leading-[1.1] font-semibold tracking-[-0.03em]">
        Something went wrong.
      </h1>
      <p className="m-0 font-body text-[16px] leading-[1.65] text-body-2">
        Terjadi kesalahan saat memuat halaman ini.
      </p>
      <div className="flex flex-wrap gap-4 font-body text-sm font-medium">
        <button
          type="button"
          onClick={() => retry()}
          className="cursor-pointer rounded text-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
        >
          Try again / Coba lagi
        </button>
        <Link
          href="/"
          className="rounded text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
        >
          Home / Beranda
        </Link>
      </div>
    </main>
  );
}
