import Link from "next/link";
import { TABLES } from "@/lib/admin/schema";

export default function AdminHome() {
  return (
    <>
      <h1 className="mt-0 mb-2 font-display text-3xl font-semibold tracking-[-0.02em]">
        Kelola konten
      </h1>
      <p className="mt-0 mb-8 max-w-xl font-body text-sm text-muted">
        Setiap perubahan langsung tersimpan di Supabase. Halaman publik
        menyegarkan isinya paling lama 60 detik setelah disimpan.
      </p>

      <div className="grid max-w-3xl gap-3 sm:grid-cols-2">
        {[
          ...TABLES.map((t) => ({
            href: `/admin/${t.key}`,
            label: t.label,
            note: t.kind === "singleton" ? "Satu entri" : "Daftar entri",
          })),
          {
            href: "/admin/assets",
            label: "Aset & CV",
            note: "Unggah foto, screenshot, PDF",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-[var(--color-line)] bg-white p-5 transition-colors hover:border-ink"
          >
            <div className="font-display text-base font-semibold">{card.label}</div>
            <div className="mt-1 font-body text-xs text-muted">{card.note}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
