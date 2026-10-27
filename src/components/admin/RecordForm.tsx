"use client";

import { Fragment, useActionState, useEffect, useRef, useState } from "react";
import { saveRecord, type ActionState } from "@/lib/admin/actions";
import type { Field, TableDef } from "@/lib/admin/schema";
import { UploadButton, publicAssetUrl } from "./UploadButton";
import { ImageCropper } from "./ImageCropper";
import { TagsControl } from "./TagsControl";
import { RowsControl } from "./RowsControl";
import { createClient } from "@/lib/supabase/client";

const INPUT =
  "w-full rounded-lg border border-[var(--color-line-strong)] bg-surface px-3 py-2 font-body text-sm outline-none focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-solid";

function TextControl({
  field,
  name,
  value,
}: {
  field: Field;
  name: string;
  value: string;
}) {
  const common = { name, defaultValue: value, className: INPUT };

  if (
    field.type === "textarea" ||
    field.type === "json" ||
    field.type === "array"
  ) {
    return <textarea rows={field.type === "textarea" ? 4 : 5} {...common} />;
  }
  return <input type="text" {...common} />;
}

/**
 * Kolom path berkas dengan tombol unggah menyatu.
 *
 * Terkendali (controlled), tidak seperti kolom teks lain, karena tombol unggah
 * harus bisa menulis nilainya. Untuk kolom galeri (`array`) hasil unggahan
 * ditambahkan di akhir daftar; urutannya diatur dengan menyeret thumbnail, dan
 * daftar path-nya dikirim lewat input tersembunyi (satu path per baris).
 */
function AssetControl({
  field,
  initial,
  onDirty,
}: {
  field: Field;
  initial: string;
  onDirty: () => void;
}) {
  const [value, setRaw] = useState(initial);
  const setValue = (v: string | ((prev: string) => string)) => {
    setRaw(v);
    onDirty();
  };
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  /** Foto galeri yang sedang di-crop ulang. */
  const [editing, setEditing] = useState<number | null>(null);
  /** Berkas yang dibuang dari galeri; dihapus dari Storage setelah Simpan berhasil. */
  const [removed, setRemoved] = useState<string[]>([]);
  /** Foto yang dipilih sekaligus, di-crop satu per satu sebelum diunggah. */
  const [queue, setQueue] = useState<File[]>([]);
  const [queueTotal, setQueueTotal] = useState(0);
  const bucket = field.bucket ?? "assets";
  const isList = field.type === "array";
  const isVideo = field.media === "video";
  const isCutout = field.media === "cutout";

  const paths = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // Pola yang sama dengan ReorderableList: urutan bergeser selagi diseret.
  function moveOver(overIndex: number) {
    if (dragIndex === null || dragIndex === overIndex) return;
    const next = paths.slice();
    const [moved] = next.splice(dragIndex, 1);
    next.splice(overIndex, 0, moved);
    setValue(next.join("\n"));
    setDragIndex(overIndex);
  }

  /** Unggah satu gambar hasil potongan; mengembalikan nama berkasnya, atau null bila gagal. */
  async function uploadBlob(
    blob: Blob,
    sourceName: string,
  ): Promise<string | null> {
    setBusy(true);
    setUploadError(null);
    const safe = sourceName
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9._-]/g, "-");
    const name = `${Date.now()}-${safe}.${isCutout ? "png" : "jpg"}`;
    const { error } = await createClient()
      .storage.from(bucket)
      .upload(name, blob, {
        upsert: false,
        cacheControl: "3600",
        contentType: isCutout ? "image/png" : "image/jpeg",
      });
    setBusy(false);
    if (error) {
      setUploadError(error.message);
      return null;
    }
    return name;
  }

  function pickMany(e: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files ?? [])];
    e.target.value = "";
    setEditing(null);
    setQueue(files);
    setQueueTotal(files.length);
  }

  function removeAt(i: number) {
    if (
      !window.confirm(
        "Hapus foto ini? Berkasnya ikut dihapus dari Storage saat kamu menekan Simpan.",
      )
    )
      return;
    const path = paths[i];
    setValue(paths.filter((_, j) => j !== i).join("\n"));
    setRemoved((r) => [...r, path]);
    setEditing(null);
  }

  return (
    <div className="mt-1.5 grid gap-2.5">
      {isList ? (
        <>
          <input type="hidden" name={field.name} value={paths.join("\n")} />
          <input
            type="hidden"
            name="__remove_assets"
            value={removed.join("\n")}
          />
        </>
      ) : (
        <input
          type="text"
          name={field.name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={INPUT}
        />
      )}

      {bucket === "documents" ? (
        <UploadButton
          bucket={bucket}
          accept=".pdf"
          label="Unggah & isi"
          onDone={(name) => setValue(name)}
        />
      ) : isVideo ? (
        // Video diunggah apa adanya — tanpa crop; pemiliknya selalu mengunggah 16:9.
        <UploadButton
          bucket={bucket}
          accept="video/mp4,video/webm"
          label="Unggah video"
          onDone={(name) => setValue(name)}
        />
      ) : isList ? (
        <>
          {/*
           * Galeri: pilih banyak foto sekaligus, lalu crop 16:9 satu per satu
           * sebelum diunggah. "Batal" melewati foto itu saja.
           */}
          {queue.length ? (
            <ImageCropper
              key={`${queueTotal - queue.length}-${queue[0].name}`}
              aspect={16 / 9}
              format="jpeg"
              busy={busy}
              initialFile={queue[0]}
              initialName={queue[0].name}
              note={
                <p className="m-0 font-body text-xs text-muted">
                  Foto {queueTotal - queue.length + 1} dari {queueTotal}:{" "}
                  {queue[0].name}
                </p>
              }
              confirmLabel="Potong & unggah"
              onCancel={() => setQueue((q) => q.slice(1))}
              onConfirm={async (blob, sourceName) => {
                const name = await uploadBlob(blob, sourceName);
                if (!name) return;
                setValue((prev) =>
                  prev.trim() ? `${prev.trim()}\n${name}` : name,
                );
                setQueue((q) => q.slice(1));
              }}
            />
          ) : (
            <label className="inline-flex w-fit cursor-pointer items-center rounded-lg border border-[var(--color-line-strong)] bg-surface px-3 py-1.5 font-display text-[13px] font-semibold">
              Unggah foto (bisa banyak)
              <input
                type="file"
                multiple
                accept="image/png,image/webp,image/jpeg"
                onChange={pickMany}
                disabled={busy}
                className="hidden"
              />
            </label>
          )}

          {!queue.length && editing !== null && paths[editing] ? (
            <ImageCropper
              key={paths[editing]}
              aspect={16 / 9}
              format="jpeg"
              busy={busy}
              initialSrc={publicAssetUrl(bucket, paths[editing])}
              initialName={paths[editing].replace(/^\d+-/, "")}
              confirmLabel="Simpan crop"
              onCancel={() => setEditing(null)}
              onConfirm={async (blob, sourceName) => {
                const old = paths[editing];
                const name = await uploadBlob(blob, sourceName);
                if (!name) return;
                setValue(paths.map((p) => (p === old ? name : p)).join("\n"));
                setRemoved((r) => [...r, old]);
                setEditing(null);
              }}
            />
          ) : null}
        </>
      ) : (
        /*
         * Screenshot dipotong 16:9 sebelum diunggah — itu rasio jendela
         * browser, dan itu pula rasio kotak yang menampilkannya. Tanpa ini,
         * screenshot apa pun akan terpotong sendiri oleh kotaknya, dan tidak
         * ada yang bisa mengatur bagian mana yang dibuang.
         *
         * JPEG, bukan PNG: screenshot tidak punya bagian transparan, dan
         * berkasnya jauh lebih kecil. Kecuali foto hero (`cutout`): 4:5 dan
         * PNG, sama dengan cropper di halaman Aset.
         */
        <ImageCropper
          aspect={isCutout ? 4 / 5 : 16 / 9}
          format={isCutout ? "png" : "jpeg"}
          busy={busy}
          pickLabel="Unggah & isi"
          confirmLabel="Potong & unggah"
          onConfirm={async (blob, sourceName) => {
            const name = await uploadBlob(blob, sourceName);
            if (name) setValue(name);
          }}
        />
      )}

      {uploadError ? (
        <p className="m-0 font-body text-xs text-red-700">{uploadError}</p>
      ) : null}

      {isVideo && value.trim() ? (
        <video
          src={publicAssetUrl(bucket, value.trim())}
          muted
          controls
          preload="metadata"
          className="aspect-[16/9] w-64 rounded-md border border-[var(--color-line)] bg-page"
        />
      ) : null}

      {!isVideo && bucket === "assets" && paths.length ? (
        <div className="flex flex-wrap gap-2">
          {paths.map((path, i) =>
            isList ? (
              <div
                key={path}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  moveOver(i);
                }}
                // Tanpa ini, berkas dari desktop yang dijatuhkan ke sini dibuka
                // browser dan isi form yang belum disimpan hilang.
                onDrop={(e) => e.preventDefault()}
                onDragEnd={() => setDragIndex(null)}
                className={`cursor-grab ${dragIndex === i ? "opacity-50" : ""}`}
              >
                {/* Label "Utama" menempel di gambarnya, bukan di baris tombol. */}
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={publicAssetUrl(bucket, path)}
                    alt={path}
                    draggable={false}
                    className="aspect-[16/9] w-36 rounded-md border border-[var(--color-line)] bg-page object-cover"
                  />
                  {i === 0 ? (
                    <span className="absolute bottom-1 left-1 rounded bg-ink px-1.5 py-0.5 font-mono text-[10px] text-on-ink">
                      Utama
                    </span>
                  ) : null}
                </div>
                <div className="mt-1 flex gap-1">
                  <button
                    type="button"
                    onClick={() => setEditing(i)}
                    disabled={busy}
                    className="cursor-pointer rounded-md border border-[var(--color-line-strong)] px-2 py-1 font-display text-[11px] font-semibold"
                  >
                    Crop
                  </button>
                  <button
                    type="button"
                    aria-label={`Hapus ${path}`}
                    onClick={() => removeAt(i)}
                    disabled={busy}
                    className="cursor-pointer rounded-md border border-red-300 px-2 py-1 font-display text-[11px] font-semibold text-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ) : (
              // <img> biasa, bukan next/image: ini halaman admin, dan berkas
              // yang baru diunggah belum tentu sudah ada saat render.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={path}
                src={publicAssetUrl(bucket, path)}
                alt={path}
                className="h-16 w-16 rounded-md border border-[var(--color-line)] bg-page object-contain"
              />
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

function renderValue(field: Field, raw: unknown): string {
  if (raw === null || raw === undefined) return "";
  if (field.type === "array") {
    return Array.isArray(raw) ? raw.join("\n") : String(raw);
  }
  if (field.type === "json") {
    return JSON.stringify(raw, null, 2);
  }
  return String(raw);
}

function FieldRow({
  field,
  record,
  onDirty,
}: {
  field: Field;
  record: Record<string, unknown>;
  onDirty: () => void;
}) {
  // Nilainya dijaga form, bukan diketik: mis. `sort` diatur lewat seret di daftar.
  if (field.hidden) {
    return (
      <input
        type="hidden"
        name={field.name}
        defaultValue={String(record[field.name] ?? 0)}
      />
    );
  }

  if (field.type === "bool") {
    return (
      <label className="flex items-center gap-2.5 py-1 font-body text-sm font-medium">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={Boolean(record[field.name])}
          className="h-4 w-4"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "number") {
    return (
      <label className="block font-body text-sm font-medium">
        {field.label}
        <input
          type="number"
          step="any"
          name={field.name}
          defaultValue={String(record[field.name] ?? 0)}
          className={`mt-1.5 ${INPUT}`}
        />
      </label>
    );
  }

  if (field.bilingual) {
    return (
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-1.5 p-0 font-body text-sm font-medium">
          {field.label}
          {field.hint ? (
            <span className="ml-2 font-normal text-muted">{field.hint}</span>
          ) : null}
        </legend>
        <div className="grid gap-3 md:grid-cols-2">
          {(["en", "id"] as const).map((lng) => (
            <label key={lng} className="block">
              <span className="mb-1 block font-mono text-[11px] text-muted">
                {lng === "en" ? "English" : "Indonesia"}
              </span>
              <TextControl
                field={field}
                name={`${field.name}_${lng}`}
                value={renderValue(field, record[`${field.name}_${lng}`])}
              />
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  // Kolom berkas (path tunggal atau daftar galeri) dapat tombol unggahnya sendiri.
  if (field.type === "asset" || (field.type === "array" && field.bucket)) {
    return (
      <div className="block font-body text-sm font-medium">
        {field.label}
        {field.hint ? (
          <span className="ml-2 font-normal text-muted">{field.hint}</span>
        ) : null}
        <AssetControl
          field={field}
          initial={renderValue(field, record[field.name])}
          onDirty={onDirty}
        />
      </div>
    );
  }

  if (field.type === "array" && field.chips) {
    const raw = record[field.name];
    return (
      <div className="block font-body text-sm font-medium">
        {field.label}
        <span className="ml-2 font-normal text-muted">
          {field.hint ?? "Enter atau koma untuk menambah"}
        </span>
        <TagsControl
          name={field.name}
          initial={Array.isArray(raw) ? raw.map(String) : []}
          onDirty={onDirty}
        />
      </div>
    );
  }

  if (field.type === "json" && field.rows) {
    return (
      <div className="block font-body text-sm font-medium">
        {field.label}
        {field.hint ? (
          <span className="ml-2 font-normal text-muted">{field.hint}</span>
        ) : null}
        <RowsControl
          name={field.name}
          cols={field.rows}
          initial={record[field.name]}
          onDirty={onDirty}
        />
      </div>
    );
  }

  return (
    <label className="block font-body text-sm font-medium">
      {field.label}
      {field.hint ? (
        <span className="ml-2 font-normal text-muted">{field.hint}</span>
      ) : null}
      <div className="mt-1.5">
        <TextControl
          field={field}
          name={field.name}
          value={renderValue(field, record[field.name])}
        />
      </div>
    </label>
  );
}

/** "Commission Tracker!" menjadi "commission-tracker". */
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function RecordForm({
  def,
  record,
  rowId,
}: {
  def: TableDef;
  record: Record<string, unknown>;
  /** Hanya untuk koleksi: id baris (kosong = baris baru). */
  rowId?: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveRecord,
    { error: null, ok: false },
  );

  // "Belum disimpan" = ada perubahan sejak hasil aksi terakhir. Dibandingkan
  // dengan objek `state`, jadi hasil simpan baru otomatis menghapus tandanya
  // tanpa effect. Simpan yang gagal tetap dihitung belum tersimpan.
  const [dirtyFor, setDirtyFor] = useState<ActionState | null>(null);
  const markDirty = () => setDirtyFor(state);
  const unsaved = dirtyFor === state || state.error !== null;

  useEffect(() => {
    if (!unsaved) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [unsaved]);

  // Entri baru: ID dan slug mengikuti judul sampai pemiliknya mengetik sendiri.
  const touched = useRef(new Set<string>());
  function onInput(e: React.FormEvent<HTMLFormElement>) {
    const target = e.target as HTMLInputElement;
    if (!target.name) return;
    markDirty();
    if (rowId || def.kind !== "collection") return;
    if (target.name === "__id" || target.name === "slug") {
      touched.current.add(target.name);
    }
    if (target.name === def.titleField) {
      for (const name of ["__id", "slug"]) {
        const el = e.currentTarget.elements.namedItem(name);
        if (el instanceof HTMLInputElement && !touched.current.has(name)) {
          el.value = slugify(target.value);
        }
      }
    }
  }

  return (
    <form
      action={formAction}
      onInput={onInput}
      onChange={markDirty}
      // Ctrl/Cmd+S menyimpan tanpa harus menggulir ke tombolnya.
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
          e.preventDefault();
          e.currentTarget.requestSubmit();
        }
      }}
    >
      <input type="hidden" name="__table" value={def.key} />

      {/*
        Isian pendek yang berdampingan (`half`) berbagi satu baris; sisanya
        memenuhi lebar. Lebar maksimum 5xl: lebih lebar dari itu, kolom teks
        sulit dibaca dan isian pendek memanjang tanpa guna.
      */}
      <div className="grid max-w-5xl gap-5 md:grid-cols-2">
        {def.kind === "collection" ? (
          <label className="block font-body text-sm font-medium md:col-span-2">
            ID baris
            <span className="ml-2 font-normal text-muted">
              {rowId
                ? "tidak bisa diubah setelah dibuat"
                : "diisi otomatis dari judul; huruf kecil tanpa spasi"}
            </span>
            <input
              type="text"
              name="__id"
              required
              defaultValue={rowId ?? ""}
              readOnly={Boolean(rowId)}
              className={`mt-1.5 ${INPUT} ${rowId ? "bg-page text-muted" : ""}`}
            />
          </label>
        ) : null}

        {def.fields.map((field, i) => {
          const before = def.fields
            .slice(0, i)
            .findLast((f) => f.section)?.section;
          const heading =
            field.section && field.section !== before ? field.section : null;
          return (
            <Fragment key={field.name}>
              {heading ? (
                <h2 className="mt-4 mb-0 border-t border-[var(--color-line)] pt-5 font-display text-lg font-semibold tracking-[-0.01em] md:col-span-2">
                  {heading}
                </h2>
              ) : null}
              {field.hidden ? (
                <FieldRow field={field} record={record} onDirty={markDirty} />
              ) : (
                <div className={`min-w-0 ${field.half ? "" : "md:col-span-2"}`}>
                  <FieldRow field={field} record={record} onDirty={markDirty} />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      {/*
        Bar simpan menempel di dasar layar: form panjang (Projects) tidak
        memaksa menggulir ke bawah hanya untuk menyimpan, dan statusnya selalu
        terlihat di tempat yang sama.
      */}
      <div className="sticky bottom-0 z-10 -mx-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--color-line)] bg-page px-6 py-3 md:-mx-10 md:px-10">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-ink px-5 py-2.5 font-display text-sm font-semibold text-on-ink disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan"}
        </button>
        <p
          role={state.error ? "alert" : "status"}
          className={`m-0 font-body text-sm ${
            state.error ? "text-red-700" : "text-muted"
          }`}
        >
          {state.error ??
            (unsaved
              ? "Ada perubahan yang belum disimpan. Ctrl+S untuk menyimpan."
              : state.ok
                ? "Tersimpan. Situs publik menyegarkan dalam 60 detik."
                : "")}
        </p>
      </div>
    </form>
  );
}
