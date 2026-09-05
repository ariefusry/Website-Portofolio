import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTableDef } from "@/lib/admin/schema";
import { RecordForm } from "@/components/admin/RecordForm";

export default async function TablePage({
  params,
}: {
  params: Promise<{ table: string }>;
}) {
  const { table } = await params;
  const def = getTableDef(table);
  if (!def) notFound();

  const supabase = await createClient();

  if (def.kind === "singleton") {
    const { data } = await supabase
      .from(def.table)
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    return (
      <>
        <h1 className="mt-0 mb-6 font-display text-2xl font-semibold tracking-[-0.02em]">
          {def.label}
        </h1>
        <RecordForm def={def} record={data ?? {}} />
      </>
    );
  }

  const { data: rows, error } = await supabase
    .from(def.table)
    .select("*")
    .order("sort");

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 font-display text-2xl font-semibold tracking-[-0.02em]">
          {def.label}
        </h1>
        <Link
          href={`/admin/${def.key}/new`}
          className="rounded-lg bg-ink px-4 py-2.5 font-display text-sm font-semibold text-on-ink"
        >
          Tambah entri
        </Link>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-700">
          {error.message}
        </p>
      ) : null}

      <ul className="m-0 grid max-w-3xl list-none gap-2 p-0">
        {(rows ?? []).map((row: Record<string, unknown>) => (
          <li key={String(row.id)}>
            <Link
              href={`/admin/${def.key}/${String(row.id)}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-line)] bg-surface px-5 py-4 transition-colors hover:border-ink"
            >
              <span className="font-display text-sm font-semibold">
                {String(row[def.titleField ?? "id"] ?? row.id)}
              </span>
              <span className="font-mono text-xs text-muted">
                {String(row.id)}
              </span>
            </Link>
          </li>
        ))}
        {(rows ?? []).length === 0 && !error ? (
          <li className="font-body text-sm text-muted">Belum ada entri.</li>
        ) : null}
      </ul>
    </>
  );
}
