"use client";

import { useState } from "react";

type Row = Record<string, string>;

const CELL =
  "w-full rounded-lg border border-[var(--color-line-strong)] bg-surface px-3 py-2 font-body text-sm outline-none focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-solid";

const BTN =
  "cursor-pointer rounded-md border border-[var(--color-line-strong)] px-2 py-1 font-display text-[11px] font-semibold hover:border-ink focus-visible:outline-2 focus-visible:outline-accent-solid disabled:cursor-default disabled:opacity-40 disabled:hover:border-[var(--color-line-strong)]";

/**
 * Editor baris untuk kolom jsonb berisi daftar objek datar. Menggantikan
 * textarea JSON mentah: tidak ada kurung atau tanda kutip yang bisa salah ketik.
 *
 * Hasilnya tetap diserialisasi ke JSON di input tersembunyi, jadi server action
 * tidak berubah. Kunci di data lama yang tidak terdaftar di `cols` ikut dibawa
 * apa adanya; baris yang semua selnya kosong dibuang.
 */
export function RowsControl({
  name,
  cols,
  initial,
  onDirty,
}: {
  name: string;
  cols: { key: string; label: string }[];
  initial: unknown;
  onDirty: () => void;
}) {
  const [rows, setRows] = useState<Row[]>(() =>
    Array.isArray(initial)
      ? initial.map((r) =>
          Object.fromEntries(
            Object.entries((r ?? {}) as Record<string, unknown>).map(([k, v]) => [
              k,
              String(v ?? ""),
            ]),
          ),
        )
      : [],
  );

  function change(next: Row[]) {
    setRows(next);
    onDirty();
  }

  function setCell(i: number, key: string, value: string) {
    change(rows.map((r, j) => (j === i ? { ...r, [key]: value } : r)));
  }

  function move(i: number, to: number) {
    const next = rows.slice();
    const [row] = next.splice(i, 1);
    next.splice(to, 0, row);
    change(next);
  }

  const serialized = JSON.stringify(
    rows.filter((r) => cols.some((c) => (r[c.key] ?? "").trim())),
  );

  return (
    <div className="mt-1.5 grid gap-3">
      <input type="hidden" name={name} value={serialized} />

      {rows.length === 0 ? (
        <p className="m-0 font-body text-sm font-normal text-muted">
          Belum ada baris. Tekan Tambah baris untuk mulai.
        </p>
      ) : null}

      {rows.map((row, i) => (
        <div
          key={i}
          className="grid gap-2 rounded-xl border border-[var(--color-line)] bg-surface p-3 md:grid-cols-[1fr_auto]"
        >
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${cols.length > 2 ? 160 : 200}px, 1fr))` }}
          >
            {cols.map((c) => (
              <label key={c.key} className="block font-body text-xs font-medium text-muted">
                {c.label}
                <input
                  type="text"
                  value={row[c.key] ?? ""}
                  onChange={(e) => setCell(i, c.key, e.target.value)}
                  // Enter di sini menambah kenyamanan mengetik, bukan mengirim form.
                  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                  className={`mt-1 text-ink ${CELL}`}
                />
              </label>
            ))}
          </div>
          <div className="flex items-end gap-1 md:flex-col md:items-stretch md:justify-end">
            <button
              type="button"
              className={BTN}
              disabled={i === 0}
              onClick={() => move(i, i - 1)}
              aria-label={`Naikkan baris ${i + 1}`}
            >
              Naik
            </button>
            <button
              type="button"
              className={BTN}
              disabled={i === rows.length - 1}
              onClick={() => move(i, i + 1)}
              aria-label={`Turunkan baris ${i + 1}`}
            >
              Turun
            </button>
            <button
              type="button"
              className={`${BTN} border-red-300 text-red-700 hover:border-red-700`}
              onClick={() => change(rows.filter((_, j) => j !== i))}
              aria-label={`Hapus baris ${i + 1}`}
            >
              Hapus
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => change([...rows, Object.fromEntries(cols.map((c) => [c.key, ""]))])}
        className={`${BTN} w-fit px-3 py-1.5 text-[13px]`}
      >
        Tambah baris
      </button>
    </div>
  );
}
