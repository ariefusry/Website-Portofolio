"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveRecord, type ActionState } from "@/lib/admin/actions";
import type { Field, TableDef } from "@/lib/admin/schema";
import { UploadButton, publicAssetUrl } from "./UploadButton";
import { ImageCropper } from "./ImageCropper";
import { createClient } from "@/lib/supabase/client";

const INPUT =
  "w-full rounded-lg border border-[var(--color-line-strong)] bg-surface px-3 py-2 font-body text-sm outline-none focus:border-ink";

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

  if (field.type === "textarea" || field.type === "json" || field.type === "array") {
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
}: {
  field: Field;
  initial: string;
}) {
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const bucket = field.bucket ?? "assets";
  const isList = field.type === "array";
  const isVideo = field.media === "video";

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

  return (
    <div className="mt-1.5 grid gap-2.5">
      {isList ? (
        <input type="hidden" name={field.name} value={paths.join("\n")} />
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
      ) : (
        /*
         * Screenshot dipotong 16:9 sebelum diunggah — itu rasio jendela
         * browser, dan itu pula rasio kotak yang menampilkannya. Tanpa ini,
         * screenshot apa pun akan terpotong sendiri oleh kotaknya, dan tidak
         * ada yang bisa mengatur bagian mana yang dibuang.
         *
         * JPEG, bukan PNG: screenshot tidak punya bagian transparan, dan
         * berkasnya jauh lebih kecil.
         */
        <ImageCropper
          aspect={16 / 9}
          format="jpeg"
          busy={busy}
          pickLabel={isList ? "Unggah & tambahkan" : "Unggah & isi"}
          confirmLabel="Potong & unggah"
          onConfirm={async (blob, sourceName) => {
            setBusy(true);
            setUploadError(null);
            const safe = sourceName
              .replace(/\.[^.]+$/, "")
              .replace(/[^a-zA-Z0-9._-]/g, "-");
            const name = `${Date.now()}-${safe}.jpg`;
            const supabase = createClient();
            const { error } = await supabase.storage
              .from(bucket)
              .upload(name, blob, {
                upsert: false,
                cacheControl: "3600",
                contentType: "image/jpeg",
              });
            if (error) setUploadError(error.message);
            else
              setValue((prev) => {
                if (!isList) return name;
                const existing = prev.trim();
                return existing ? `${existing}\n${name}` : name;
              });
            setBusy(false);
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
                onDragEnd={() => setDragIndex(null)}
                className={`relative cursor-grab ${dragIndex === i ? "opacity-50" : ""}`}
              >
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
                <button
                  type="button"
                  aria-label={`Hapus ${path} dari galeri`}
                  onClick={() => setValue(paths.filter((_, j) => j !== i).join("\n"))}
                  className="absolute top-1 right-1 h-6 w-6 cursor-pointer rounded-full bg-ink text-xs leading-none text-on-ink"
                >
                  ×
                </button>
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
}: {
  field: Field;
  record: Record<string, unknown>;
}) {
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
        </legend>
        <div className="grid gap-3 md:grid-cols-2">
          {(["en", "id"] as const).map((lng) => (
            <div key={lng}>
              <div className="mb-1 font-mono text-[11px] text-muted">
                {lng.toUpperCase()}
              </div>
              <TextControl
                field={field}
                name={`${field.name}_${lng}`}
                value={renderValue(field, record[`${field.name}_${lng}`])}
              />
            </div>
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-ink px-5 py-2.5 font-display text-sm font-semibold text-on-ink disabled:opacity-60"
    >
      {pending ? "Menyimpan…" : "Simpan"}
    </button>
  );
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
  const [state, formAction] = useActionState<ActionState, FormData>(saveRecord, {
    error: null,
    ok: false,
  });

  return (
    <form action={formAction} className="grid max-w-3xl gap-5">
      <input type="hidden" name="__table" value={def.key} />

      {def.kind === "collection" ? (
        <label className="block font-body text-sm font-medium">
          ID baris
          <span className="ml-2 font-normal text-muted">
            huruf kecil tanpa spasi; tidak diubah setelah dibuat
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

      {def.fields.map((field) => (
        <FieldRow key={field.name} field={field} record={record} />
      ))}

      {state.error ? (
        <p className="m-0 rounded-lg bg-red-50 px-3 py-2 font-body text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="m-0 rounded-lg bg-green-50 px-3 py-2 font-body text-sm text-green-700">
          Tersimpan. Halaman publik menyegarkan dalam ≤60 detik.
        </p>
      ) : null}

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
