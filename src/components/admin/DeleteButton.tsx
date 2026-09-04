"use client";

import { useActionState } from "react";
import { deleteRecord, type ActionState } from "@/lib/admin/actions";

export function DeleteButton({
  tableKey,
  rowId,
}: {
  tableKey: string;
  rowId: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    deleteRecord,
    { error: null, ok: false },
  );

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(`Hapus baris "${rowId}"? Tindakan ini permanen.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="__table" value={tableKey} />
      <input type="hidden" name="__id" value={rowId} />
      <button
        type="submit"
        className="rounded-lg border border-red-300 px-4 py-2.5 font-display text-sm font-semibold text-red-700 hover:bg-red-50"
      >
        Hapus
      </button>
      {state.error ? (
        <p className="mt-2 mb-0 font-body text-sm text-red-700">{state.error}</p>
      ) : null}
    </form>
  );
}
