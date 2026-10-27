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
  const supabase = await createClient();

  if (!isNew) {
    const { data } = await supabase
      .from(def.table)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!data) notFound();
    record = data;
  } else {
    // Urutan tidak diketik: entri baru masuk di akhir, lalu diseret di daftar.
    const { data } = await supabase
      .from(def.table)
      .select("sort")
      .order("sort", { ascending: false })
      .limit(1)
      .maybeSingle();
    record = { sort: Number(data?.sort ?? 0) + 1 };
  }

  const liveHref =
    def.key === "projects" && !isNew && record.slug
      ? `/projects/${String(record.slug)}`
      : null;

  return (
    <>
      <Link
        href={`/admin/${def.key}`}
        className="font-body text-sm text-muted hover:text-ink"
      >
        ← {def.label}
      </Link>

      <div className="mt-3 mb-6 flex max-w-5xl flex-wrap items-baseline justify-between gap-3">
        <h1 className="m-0 font-display text-2xl font-semibold tracking-[-0.02em]">
          {isNew
            ? `Entri baru, ${def.label}`
            : String(record[def.titleField ?? "id"] ?? record.id)}
        </h1>
        {liveHref ? (
          <Link
            href={liveHref}
            target="_blank"
            className="font-body text-sm text-muted hover:text-ink"
          >
            Lihat di situs
          </Link>
        ) : null}
      </div>

      <RecordForm def={def} record={record} rowId={isNew ? undefined : id} />

      {!isNew ? (
        <div className="mt-10 max-w-5xl border-t border-[var(--color-line)] pt-6">
          <DeleteButton tableKey={def.key} rowId={id} />
        </div>
      ) : null}
    </>
  );
}
