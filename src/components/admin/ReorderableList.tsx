"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { reorderRows } from "@/lib/admin/actions";
import type { TableDef } from "@/lib/admin/schema";

type Row = Record<string, unknown>;

/**
 * Daftar entri collection, diurutkan lewat drag-and-drop HTML5 native (tanpa
 * library). Urutan lokal berubah instan saat diseret; `sort` ditulis ulang ke
 * database lewat satu server action begitu drag selesai.
 */
export function ReorderableList({
  def,
  initialRows,
}: {
  def: TableDef;
  initialRows: Row[];
}) {
  const [rows, setRows] = useState(initialRows);
  // Urutan terakhir yang benar-benar tersimpan, untuk dikembalikan bila gagal.
  const [saved, setSaved] = useState(initialRows);
  const [error, setError] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function moveOver(overId: string) {
    if (!dragId || dragId === overId) return;
    setRows((prev) => {
      const from = prev.findIndex((r) => String(r.id) === dragId);
      const to = prev.findIndex((r) => String(r.id) === overId);
      if (from === -1 || to === -1) return prev;
      const next = prev.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function persist(order: Row[]) {
    startTransition(async () => {
      const res = await reorderRows(def.key, order.map((r) => String(r.id)));
      if (res.ok) {
        setSaved(order);
        setError(null);
      } else {
        setRows(saved);
        setError(res.error);
      }
    });
  }

  if (rows.length === 0) {
    return <p className="font-body text-sm text-muted">Belum ada entri.</p>;
  }

  return (
    <>
      {error ? (
        <p role="alert" className="mb-3 font-body text-sm text-red-600">
          Urutan gagal disimpan: {error}
        </p>
      ) : null}
      <ul className="m-0 grid max-w-3xl list-none gap-2 p-0">
        {rows.map((row) => {
          const id = String(row.id);
          return (
            <li
              key={id}
              draggable
              onDragStart={() => setDragId(id)}
              onDragOver={(e) => {
                e.preventDefault();
                moveOver(id);
              }}
              onDrop={(e) => e.preventDefault()}
              onDragEnd={() => {
                setDragId(null);
                persist(rows);
              }}
              className="flex cursor-grab items-center gap-3 rounded-xl border border-[var(--color-line)] bg-surface px-5 py-4 transition-colors hover:border-ink active:cursor-grabbing"
            >
              <span aria-hidden="true" className="shrink-0 touch-none select-none text-muted-2">
                ⠿
              </span>
              <Link
                href={`/admin/${def.key}/${id}`}
                className="flex flex-1 items-center justify-between gap-4"
              >
                <span className="font-display text-sm font-semibold">
                  {String(row[def.titleField ?? "id"] ?? row.id)}
                </span>
                <span className="font-mono text-xs text-muted">{id}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
