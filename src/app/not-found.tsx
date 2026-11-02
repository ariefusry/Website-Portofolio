import Link from "next/link";

/**
 * 404 untuk seluruh situs. Seperti error.tsx, LangProvider belum tersedia di
 * sini, jadi teksnya ditulis dalam dua bahasa sekaligus.
 */
export default function NotFound() {
  return (
    <main className="section-x section-inner flex min-h-[60vh] flex-col items-start justify-center gap-4 py-16">
      <h1 className="m-0 font-display text-[clamp(26px,5vw,36px)] leading-[1.1] font-semibold tracking-[-0.03em]">
        Page not found.
      </h1>
      <p className="m-0 font-body text-[16px] leading-[1.65] text-body-2">
        Halaman ini tidak ada atau sudah dipindahkan.
      </p>
      <div className="flex flex-wrap gap-4 font-body text-sm font-medium">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded text-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
        >
          Home / Beranda
        </Link>
        <Link
          href="/projects"
          className="inline-flex min-h-11 items-center rounded text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
        >
          Projects / Proyek
        </Link>
      </div>
    </main>
  );
}
