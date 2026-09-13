import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTableDef } from "@/lib/admin/schema";
import { RecordForm } from "@/components/admin/RecordForm";
import { ReorderableList } from "@/components/admin/ReorderableList";

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

      {!error ? <ReorderableList def={def} initialRows={rows ?? []} /> : null}
    </>
  );
}
