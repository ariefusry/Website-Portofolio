"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

/** Batas sisi panjang hasil crop, supaya berkasnya tidak sebesar aslinya. */
const MAX_EDGE = 1600;

/**
 * Potong `area` dari gambar dan kembalikan berkasnya.
 *
 * `png` menjaga transparansi — wajib untuk foto profil cutout. `jpeg` jauh
 * lebih kecil untuk screenshot yang memang tidak punya bagian transparan;
 * kanvasnya diisi putih dulu karena JPEG tidak punya kanal alpha dan bagian
 * transparan akan jadi hitam kalau dibiarkan.
 */
async function cropToBlob(
  src: string,
  area: Area,
  format: "png" | "jpeg",
): Promise<Blob> {
  const img = new Image();
  img.src = src;
  await img.decode();

  const scale = Math.min(1, MAX_EDGE / Math.max(area.width, area.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width * scale);
  canvas.height = Math.round(area.height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia di browser ini.");

  if (format === "jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

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
      (blob) => (blob ? resolve(blob) : reject(new Error("Gagal memotong gambar."))),
      format === "png" ? "image/png" : "image/jpeg",
      format === "jpeg" ? 0.9 : undefined,
    );
  });
}

/**
 * Pemilih berkas + crop dengan rasio tetap. Dipakai bersama oleh foto profil
 * (4:5, PNG supaya latar transparannya selamat) dan screenshot proyek
 * (16:9, ukuran jendela browser, JPEG supaya berkasnya ringan).
 *
 * Komponen ini tidak tahu-menahu soal unggah — ia hanya menyerahkan Blob hasil
 * potongan, dan pemanggilnya yang memutuskan mau diapakan.
 */
export function ImageCropper({
  aspect,
  format = "png",
  accept = "image/png,image/webp,image/jpeg",
  pickLabel = "Pilih gambar",
  confirmLabel = "Potong & unggah",
  note,
  busy = false,
  onConfirm,
}: {
  aspect: number;
  format?: "png" | "jpeg";
  accept?: string;
  pickLabel?: string;
  confirmLabel?: string;
  note?: React.ReactNode;
  busy?: boolean;
  onConfirm: (blob: Blob, sourceName: string) => void | Promise<void>;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setSourceName(file.name);
    setSrc(URL.createObjectURL(file));
    e.target.value = "";
  }

  async function confirm() {
    if (!src || !area) return;
    try {
      setError(null);
      const blob = await cropToBlob(src, area, format);
      await onConfirm(blob, sourceName);
      setSrc(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memotong gambar.");
    }
  }

  return (
    <div className="grid gap-2.5">
      {src ? null : (
        <label className="inline-flex w-fit cursor-pointer items-center rounded-lg border border-[var(--color-line-strong)] bg-surface px-3 py-1.5 font-display text-[13px] font-semibold">
          {pickLabel}
          <input
            type="file"
            accept={accept}
            onChange={pick}
            disabled={busy}
            className="hidden"
          />
        </label>
      )}

      {note}

      {src ? (
        <>
          <div className="relative h-[320px] overflow-hidden rounded-xl border border-[var(--color-line)] bg-page">
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              restrictPosition={false}
            />
          </div>

          <label className="flex items-center gap-3 font-body text-sm">
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

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={confirm}
              disabled={busy || !area}
              className="cursor-pointer rounded-lg bg-ink px-4 py-2 font-display text-[13px] font-semibold text-on-ink disabled:opacity-60"
            >
              {busy ? "Menyimpan…" : confirmLabel}
            </button>
            <button
              type="button"
              onClick={() => setSrc(null)}
              disabled={busy}
              className="cursor-pointer rounded-lg border border-[var(--color-line-strong)] px-4 py-2 font-display text-[13px] font-semibold"
            >
              Batal
            </button>
          </div>
        </>
      ) : null}

      {error ? (
        <p className="m-0 font-body text-xs text-red-700">{error}</p>
      ) : null}
    </div>
  );
}
