import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTableDef } from "@/lib/admin/schema";
import { RecordForm } from "@/components/admin/RecordForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function RecordPage({
  params,
}: {
  params: Promise<{ table: string; id: string }>;
}) {
  const { table, id } = await params;
  const def = getTableDef(table);
  if (!def || def.kind !== "collection") notFound();

  const isNew = id === "new";
  let record: Record<string, unknown> = {};

  if (!isNew) {
    const supabase = await createClient();
    const { data } = await supabase
      .from(def.table)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!data) notFound();
    record = data;
  }

  return (
    <>
      <Link
        href={`/admin/${def.key}`}
        className="font-body text-sm text-muted hover:text-ink"
      >
        ← {def.label}
      </Link>

      <h1 className="mt-3 mb-6 font-display text-2xl font-semibold tracking-[-0.02em]">
        {isNew ? `Entri baru — ${def.label}` : String(record.id)}
      </h1>

      <RecordForm def={def} record={record} rowId={isNew ? undefined : id} />

      {!isNew ? (
        <div className="mt-10 max-w-3xl border-t border-[var(--color-line)] pt-6">
          <DeleteButton tableKey={def.key} rowId={id} />
        </div>
      ) : null}
    </>
  );
}
