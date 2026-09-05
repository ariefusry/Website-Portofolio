"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { createClient } from "@/lib/supabase/client";
import { setProfilePhoto } from "@/lib/admin/actions";

/** Rasio slot foto di hero. */
const ASPECT = 4 / 5;

/** Batas sisi panjang hasil crop. Slot hero 360px; 900 cukup untuk layar retina. */
const MAX_H = 900;

/**
 * Potong `area` dari gambar lalu kembalikan PNG.
 *
 * Dua hal di sini yang menentukan transparansi selamat atau tidak:
 * canvas TIDAK pernah diisi warna dulu (ia sudah transparan sejak dibuat), dan
 * hasilnya diekspor ke image/png — JPEG akan mengubah bagian transparan jadi
 * hitam, yang justru masalah yang ingin dihindari.
 */
async function cropToPng(src: string, area: Area): Promise<Blob> {
  const img = new Image();
  img.src = src;
  await img.decode();

  const scale = Math.min(1, MAX_H / area.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width * scale);
  canvas.height = Math.round(area.height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia di browser ini.");

  ctx.drawImage(
    img,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Gagal membuat berkas PNG.")),
      "image/png",
    );
  });
}

export function PhotoCropper() {
  const [src, setSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [warnJpeg, setWarnJpeg] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  // Object URL harus dilepas, kalau tidak berkasnya menggantung di memori.
  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [src]);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setArea(pixels);
  }, []);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSaved(null);
    // JPEG tidak punya kanal alpha. Boleh diteruskan, tapi hasilnya pasti
    // berlatar kotak — jadi katakan sekarang, bukan setelah diunggah.
    setWarnJpeg(file.type === "image/jpeg");
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setSrc(URL.createObjectURL(file));
    setFileName(`profile-${Date.now()}.png`);
    e.target.value = "";
  }

  async function save() {
    if (!src || !area) return;
    setBusy(true);
    setError(null);

    try {
      const blob = await cropToPng(src, area);
      const supabase = createClient();
      const { error: upErr } = await supabase.storage
        .from("assets")
        .upload(fileName, blob, {
          upsert: true,
          cacheControl: "3600",
          contentType: "image/png",
        });
      if (upErr) throw new Error(upErr.message);

      const res = await setProfilePhoto(fileName);
      if (res.error) throw new Error(res.error);

      setSaved(fileName);
      setSrc(null);
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

      <label className="mb-4 inline-block cursor-pointer rounded-lg border border-[var(--color-line-strong)] bg-surface px-4 py-2.5 font-display text-sm font-semibold">
        Pilih gambar
        <input
          type="file"
          accept="image/png,image/webp,image/jpeg"
          onChange={pick}
          disabled={busy}
          className="hidden"
        />
      </label>

      {warnJpeg && src ? (
        <p className="mb-4 rounded-lg border border-[var(--color-line-strong)] bg-surface px-3 py-2 font-body text-sm">
          Berkas ini JPEG, yang tidak bisa menyimpan transparansi. Hasilnya akan
          tetap berupa kotak berisi latar aslinya. Untuk tampilan menyatu,
          hapus dulu latarnya lalu simpan sebagai PNG.
        </p>
      ) : null}

      {src ? (
        <>
          <div className="relative mb-3 h-[420px] overflow-hidden rounded-xl border border-[var(--color-line)] bg-page">
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={ASPECT}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              restrictPosition={false}
            />
          </div>

          <label className="mb-4 flex items-center gap-3 font-body text-sm">
            <span className="shrink-0 text-muted">Perbesar</span>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={save}
              disabled={busy || !area}
              className="cursor-pointer rounded-lg bg-ink px-5 py-2.5 font-display text-sm font-semibold text-on-ink disabled:opacity-60"
            >
              {busy ? "Menyimpan…" : "Simpan sebagai foto profil"}
            </button>
            <button
              type="button"
              onClick={() => setSrc(null)}
              disabled={busy}
              className="cursor-pointer rounded-lg border border-[var(--color-line-strong)] px-4 py-2.5 font-display text-sm font-semibold"
            >
              Batal
            </button>
          </div>
        </>
      ) : null}

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
