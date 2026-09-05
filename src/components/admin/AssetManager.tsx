"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Bucket = "assets" | "documents";
type Item = { name: string; size: number | null; url: string };

const BUCKET_LABEL: Record<Bucket, string> = {
  assets: "assets — foto profil & screenshot",
  documents: "documents — CV dan berkas lain",
};

function BucketPanel({ bucket }: { bucket: Bucket }) {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Dinaikkan setelah unggah/hapus untuk memuat ulang daftar.
  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    // Flag pembatalan: kalau bucket berganti atau komponen di-unmount sebelum
    // request selesai, hasil yang basi tidak boleh menimpa daftar yang baru.
    let cancelled = false;

    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from(bucket)
        .list("", { limit: 100, sortBy: { column: "name", order: "asc" } });
      if (cancelled) return;

      if (error) {
        setError(error.message);
        return;
      }
      setError(null);
      setItems(
        (data ?? [])
          .filter((f) => f.id !== null) // buang entri folder
          .map((f) => ({
            name: f.name,
            size: f.metadata?.size ?? null,
            url: supabase.storage.from(bucket).getPublicUrl(f.name).data
              .publicUrl,
          })),
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [bucket, version]);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.storage
      .from(bucket)
      .upload(file.name, file, { upsert: true, cacheControl: "3600" });

    if (error) setError(error.message);
    e.target.value = "";
    setBusy(false);
    reload();
  }

  async function remove(name: string) {
    if (!window.confirm(`Hapus "${name}" dari bucket ${bucket}?`)) return;
    const supabase = createClient();
    const { error } = await supabase.storage.from(bucket).remove([name]);
    if (error) setError(error.message);
    reload();
  }

  return (
    <section className="mb-10 max-w-3xl">
      <h2 className="mt-0 mb-1 font-display text-lg font-semibold">
        {BUCKET_LABEL[bucket]}
      </h2>
      <p className="mt-0 mb-4 font-body text-sm text-muted">
        Nama berkas yang diunggah adalah nilai yang dimasukkan ke kolom path
        (mis. <code>profile.jpg</code>). Mengunggah nama yang sama akan menimpa.
      </p>

      <label className="mb-4 inline-block cursor-pointer rounded-lg border border-[var(--color-line-strong)] bg-surface px-4 py-2.5 font-display text-sm font-semibold">
        {busy ? "Mengunggah…" : "Pilih berkas"}
        <input
          type="file"
          onChange={upload}
          disabled={busy}
          className="hidden"
          accept={bucket === "documents" ? ".pdf" : "image/*"}
        />
      </label>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <ul className="m-0 grid list-none gap-2 p-0">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-line)] bg-surface px-4 py-3"
          >
            <div className="min-w-0">
              <div className="truncate font-mono text-sm">{item.name}</div>
              <div className="font-body text-xs text-muted">
                {item.size !== null ? `${Math.round(item.size / 1024)} KB` : "—"}
              </div>
            </div>
            <div className="flex items-center gap-2 font-body text-sm">
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(item.name);
                  setCopied(item.name);
                  window.setTimeout(() => setCopied(null), 1500);
                }}
                className="rounded-md border border-[var(--color-line-strong)] px-3 py-1.5 font-medium"
              >
                {copied === item.name ? "Tersalin" : "Salin path"}
              </button>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-[var(--color-line-strong)] px-3 py-1.5 font-medium"
              >
                Buka
              </a>
              <button
                type="button"
                onClick={() => void remove(item.name)}
                className="rounded-md border border-red-300 px-3 py-1.5 font-medium text-red-700"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="font-body text-sm text-muted">Belum ada berkas.</li>
        ) : null}
      </ul>
    </section>
  );
}

export function AssetManager() {
  return (
    <>
      <BucketPanel bucket="assets" />
      <BucketPanel bucket="documents" />
    </>
  );
}
