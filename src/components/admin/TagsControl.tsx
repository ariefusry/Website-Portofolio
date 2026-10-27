"use client";

import { useState } from "react";

/**
 * Daftar teks pendek (teknologi, badge, item skill) sebagai chip.
 *
 * Disimpan ke form sebagai satu item per baris lewat input tersembunyi, jadi
 * server action untuk kolom `array` tidak berubah. Enter, koma, dan tempel
 * daftar bertanda baris/koma semuanya menambah item; Backspace pada input
 * kosong membuang item terakhir.
 */
export function TagsControl({
  name,
  initial,
  onDirty,
}: {
  name: string;
  initial: string[];
  onDirty: () => void;
}) {
  const [items, setItems] = useState(initial);
  const [draft, setDraft] = useState("");

  function change(next: string[]) {
    setItems(next);
    onDirty();
  }

  function commit(raw: string) {
    const added = raw
      .split(/[\n,]/)
      .map((t) => t.trim())
      .filter((t) => t && !items.includes(t));
    setDraft("");
    if (added.length) change([...items, ...new Set(added)]);
  }

  return (
    <div className="mt-1.5">
      <input type="hidden" name={name} value={items.join("\n")} />
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[var(--color-line-strong)] bg-surface p-2 focus-within:border-ink">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 rounded-[5px] bg-accent-bg py-1 pr-1 pl-2.5 font-body text-[12.5px] leading-none font-medium"
          >
            {item}
            <button
              type="button"
              aria-label={`Hapus ${item}`}
              onClick={() => change(items.filter((t) => t !== item))}
              className="cursor-pointer rounded px-1.5 py-0.5 text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent-solid"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          placeholder={items.length ? "Tambah…" : "Ketik lalu tekan Enter"}
          onChange={(e) => {
            const v = e.target.value;
            // Koma langsung menutup item, supaya daftar yang diketik cepat tetap rapi.
            if (v.includes(",")) commit(v);
            else setDraft(v);
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (/[\n,]/.test(text)) {
              e.preventDefault();
              commit(text);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Enter di sini menambah item, bukan mengirim form.
              e.preventDefault();
              commit(draft);
            } else if (e.key === "Backspace" && !draft && items.length) {
              change(items.slice(0, -1));
            }
          }}
          onBlur={() => draft.trim() && commit(draft)}
          className="min-w-[8rem] flex-1 bg-transparent px-1.5 py-1 font-body text-sm outline-none"
        />
      </div>
    </div>
  );
}
