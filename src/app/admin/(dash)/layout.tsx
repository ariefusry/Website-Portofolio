import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/admin/actions";
import { TABLES } from "@/lib/admin/schema";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Login saja tidak cukup — user harus terdaftar di tabel admins (sama dengan RLS).
  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    return (
      <main className="mx-auto max-w-lg p-10 font-body">
        <h1 className="font-display text-2xl font-semibold">Akses ditolak</h1>
        <p className="text-muted">
          Akun <strong>{user.email}</strong> belum terdaftar sebagai admin.
          Tambahkan <code>user_id</code>-nya ke tabel <code>admins</code>.
        </p>
        <form action={signOut}>
          <button className="rounded-lg border border-[var(--color-line-strong)] px-4 py-2 font-display text-sm font-semibold">
            Keluar
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-page md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-[var(--color-line)] bg-surface p-6 md:sticky md:top-0 md:h-screen md:border-r md:border-b-0 md:overflow-y-auto">
        <Link href="/admin" className="font-display text-base font-semibold">
          Admin
        </Link>
        <nav className="mt-5 grid gap-0.5 font-body text-sm">
          {TABLES.map((t) => (
            <Link
              key={t.key}
              href={`/admin/${t.key}`}
              className="rounded-md px-2.5 py-2 hover:bg-page"
            >
              {t.label}
            </Link>
          ))}
          <Link href="/admin/assets" className="rounded-md px-2.5 py-2 hover:bg-page">
            Aset & CV
          </Link>
        </nav>
        <div className="mt-6 border-t border-[var(--color-line)] pt-4 font-body text-xs text-muted">
          <div className="mb-3 break-all">{user.email}</div>
          <Link href="/" className="block hover:text-ink">
            ← Lihat situs
          </Link>
          <form action={signOut} className="mt-3">
            <button className="font-medium hover:text-ink">Keluar</button>
          </form>
        </div>
      </aside>

      <main className="p-6 md:p-10">{children}</main>
    </div>
  );
}
