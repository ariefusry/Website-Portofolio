"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Unggah satu berkas ke bucket Storage, lalu serahkan nama berkasnya ke
 * pemanggil. Dipakai langsung di dalam form supaya isi kolom path tidak perlu
 * disalin manual dari halaman aset.
 */
export function UploadButton({
  bucket,
  accept,
  label = "Unggah berkas",
  onDone,
}: {
  bucket: "assets" | "documents";
  accept: string;
  label?: string;
  onDone: (fileName: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError(null);

    // Nama diberi awalan waktu dan dibersihkan: spasi serta karakter non-ASCII
    // menyulitkan URL, dan nama yang berulang akan tertahan cache Storage
    // (cacheControl 3600) sehingga berkas lama yang tampil.
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const name = `${Date.now()}-${safe}`;

    const supabase = createClient();
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(name, file, {
        upsert: false,
        cacheControl: "3600",
        contentType: file.type || undefined,
      });

    if (upErr) setError(upErr.message);
    else onDone(name);

    e.target.value = "";
    setBusy(false);
  }

  return (
    <div className="grid gap-1.5">
      <label className="inline-flex w-fit cursor-pointer items-center rounded-lg border border-[var(--color-line-strong)] bg-surface px-3 py-1.5 font-display text-[13px] font-semibold">
        {busy ? "Mengunggah…" : label}
        <input
          type="file"
          accept={accept}
          onChange={pick}
          disabled={busy}
          className="hidden"
        />
      </label>
      {error ? (
        <p className="m-0 font-body text-xs text-red-700">{error}</p>
      ) : null}
    </div>
  );
}

/** URL publik sebuah berkas di bucket — untuk pratinjau kecil di form. */
export function publicAssetUrl(bucket: "assets" | "documents", name: string) {
  return createClient().storage.from(bucket).getPublicUrl(name).data.publicUrl;
}
