"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { setProfilePhoto } from "@/lib/admin/actions";
import { ImageCropper } from "./ImageCropper";

export function PhotoCropper() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function save(blob: Blob) {
    setBusy(true);
    setError(null);
    try {
      // Nama bertimestamp, bukan `profile.png` tetap: Storage menyajikan dengan
      // cacheControl 3600 dan next/image ikut cache, jadi nama yang dipakai
      // ulang akan terus menampilkan crop lama sampai sejam.
      const name = `profile-${Date.now()}.png`;
      const supabase = createClient();
      const { error: upErr } = await supabase.storage
        .from("assets")
        .upload(name, blob, {
          upsert: true,
          cacheControl: "3600",
          contentType: "image/png",
        });
      if (upErr) throw new Error(upErr.message);

      const res = await setProfilePhoto(name);
      if (res.error) throw new Error(res.error);

      setSaved(name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mb-10 max-w-3xl">
      <h2 className="mt-0 mb-1 font-display text-lg font-semibold">
        Foto profil — unggah &amp; crop
      </h2>
      <p className="mt-0 mb-4 font-body text-sm text-muted">
        Pakai PNG dengan latar sudah dihapus supaya fotonya tampil menyatu di
        hero, tanpa bingkai kotak. Crop di sini hanya memotong — ia tidak
        menghapus latar belakang.
      </p>

      {/* 4:5 dan PNG: rasio slot hero, dan satu-satunya format di sini yang
          bisa membawa transparansi. */}
      <ImageCropper
        aspect={4 / 5}
        format="png"
        busy={busy}
        confirmLabel="Simpan sebagai foto profil"
        onConfirm={save}
      />

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {saved ? (
        <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 font-body text-sm text-green-700">
          Tersimpan sebagai <code>{saved}</code> dan sudah dipasang di hero.
        </p>
      ) : null}
    </section>
  );
}
