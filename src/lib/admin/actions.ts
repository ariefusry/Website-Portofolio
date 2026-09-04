"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { columnsOf, getTableDef, type Field, type TableDef } from "./schema";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) throw new Error("Akun ini bukan admin.");

  return supabase;
}

/** Ubah satu nilai form jadi tipe kolom Postgres yang benar. */
function coerce(field: Field, raw: FormDataEntryValue | null): unknown {
  const value = typeof raw === "string" ? raw : "";

  switch (field.type) {
    case "bool":
      return value === "on" || value === "true";
    case "number": {
      const n = Number(value);
      return Number.isFinite(n) ? n : 0;
    }
    case "array":
      return value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    case "json":
      try {
        return value.trim() ? JSON.parse(value) : [];
      } catch {
        throw new Error(`Kolom "${field.label}" bukan JSON yang valid.`);
      }
    default:
      return value;
  }
}

function buildPayload(def: TableDef, formData: FormData): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const field of def.fields) {
    if (field.bilingual) {
      payload[`${field.name}_en`] = coerce(
        field,
        formData.get(`${field.name}_en`),
      );
      payload[`${field.name}_id`] = coerce(
        field,
        formData.get(`${field.name}_id`),
      );
    } else {
      payload[field.name] = coerce(field, formData.get(field.name));
    }
  }

  // Kolom di luar skema tidak pernah ikut — whitelist eksplisit.
  const allowed = new Set(columnsOf(def));
  for (const key of Object.keys(payload)) {
    if (!allowed.has(key)) delete payload[key];
  }

  return payload;
}

export type ActionState = { error: string | null; ok: boolean };

export async function saveRecord(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const key = String(formData.get("__table") ?? "");
  const def = getTableDef(key);
  if (!def) return { error: "Tabel tidak dikenal.", ok: false };

  try {
    const supabase = await requireAdmin();
    const payload = buildPayload(def, formData);

    if (def.kind === "singleton") {
      payload.id = 1;
    } else {
      const id = String(formData.get("__id") ?? "").trim();
      if (!id) return { error: "ID baris wajib diisi.", ok: false };
      payload.id = id;
    }

    const { error } = await supabase.from(def.table).upsert(payload);
    if (error) return { error: error.message, ok: false };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal menyimpan.", ok: false };
  }

  revalidatePath("/");
  revalidatePath(`/admin/${key}`);
  return { error: null, ok: true };
}

export async function deleteRecord(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const key = String(formData.get("__table") ?? "");
  const id = String(formData.get("__id") ?? "");
  const def = getTableDef(key);
  if (!def || def.kind !== "collection" || !id) {
    return { error: "Permintaan hapus tidak valid.", ok: false };
  }

  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from(def.table).delete().eq("id", id);
    if (error) return { error: error.message, ok: false };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal menghapus.", ok: false };
  }

  revalidatePath("/");
  revalidatePath(`/admin/${key}`);
  redirect(`/admin/${key}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
