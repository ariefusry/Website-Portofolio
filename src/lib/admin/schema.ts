/**
 * Definisi form admin. Satu deskripsi per tabel dipakai ulang oleh:
 *  - halaman daftar & editor (rendering input),
 *  - Server Action (whitelist kolom + koersi tipe sebelum menulis ke Postgres).
 *
 * Kolom yang tidak terdaftar di sini tidak akan pernah ditulis dari dashboard.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "bool"
  | "number"
  | "array" // text[] — satu item per baris
  | "json" // jsonb — diedit sebagai JSON mentah
  | "asset"; // path di Supabase Storage

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  /** Field bilingual: mengembang jadi <name>_en dan <name>_id. */
  bilingual?: boolean;
  hint?: string;
  /** Bucket untuk field bertipe asset. */
  bucket?: "assets" | "documents";
};

export type TableDef = {
  key: string;
  table: string;
  label: string;
  kind: "singleton" | "collection";
  /** Kolom yang dipakai sebagai judul baris di halaman daftar. */
  titleField?: string;
  fields: Field[];
};

const bi = (name: string, label: string, type: FieldType = "text"): Field => ({
  name,
  label,
  type,
  bilingual: true,
});

export const TABLES: TableDef[] = [
  {
    key: "profile",
    table: "profile",
    label: "Profil & hero",
    kind: "singleton",
    fields: [
      { name: "name", label: "Nama tampil", type: "text" },
      bi("badge", "Badge status"),
      bi("hero_title", "Judul hero", "textarea"),
      bi("hero_sub", "Subjudul hero", "textarea"),
      bi("about", "Paragraf about", "textarea"),
      bi("contact_heading", "Judul kontak"),
      bi("contact_note", "Catatan kontak"),
      {
        name: "photo_path",
        label: "Foto profil",
        type: "asset",
        bucket: "assets",
        hint: "Path di bucket assets, mis. profile.jpg",
      },
      {
        name: "cv_path",
        label: "CV (PDF)",
        type: "asset",
        bucket: "documents",
        hint: "Path di bucket documents, mis. cv.pdf",
      },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Telepon", type: "text" },
      { name: "linkedin", label: "LinkedIn", type: "text", hint: "tanpa https://" },
      { name: "github", label: "GitHub", type: "text", hint: "tanpa https://" },
    ],
  },
  {
    key: "settings",
    table: "site_settings",
    label: "Pengaturan situs",
    kind: "singleton",
    fields: [
      { name: "show_blog", label: "Tampilkan section Writing", type: "bool" },
      {
        name: "default_lang",
        label: "Bahasa default",
        type: "text",
        hint: "EN atau ID",
      },
    ],
  },
  {
    key: "stats",
    table: "stats",
    label: "Stat strip",
    kind: "collection",
    titleField: "value",
    fields: [
      { name: "value", label: "Nilai", type: "text" },
      {
        name: "is_numeric",
        label: "Angka (dihitung naik saat load)",
        type: "bool",
      },
      { name: "decimals", label: "Jumlah desimal", type: "number" },
      bi("label", "Label"),
      { name: "sort", label: "Urutan", type: "number" },
    ],
  },
  {
    key: "tracks",
    table: "tracks",
    label: "Two tracks",
    kind: "collection",
    titleField: "title_en",
    fields: [
      bi("title", "Judul"),
      bi("body", "Deskripsi", "textarea"),
      { name: "chips", label: "Chip teknologi", type: "array" },
      { name: "accent", label: "Warna aksen", type: "bool" },
      { name: "sort", label: "Urutan", type: "number" },
    ],
  },
  {
    key: "projects",
    table: "projects",
    label: "Selected work",
    kind: "collection",
    titleField: "title",
    fields: [
      { name: "slug", label: "Slug", type: "text" },
      { name: "title", label: "Judul", type: "text" },
      bi("summary", "Ringkasan", "textarea"),
      { name: "badges", label: "Badge", type: "array" },
      { name: "accent_badge", label: "Badge beraksen", type: "bool" },
      { name: "tech", label: "Chip teknologi", type: "array" },
      {
        name: "image_path",
        label: "Screenshot",
        type: "asset",
        bucket: "assets",
      },
      { name: "github_url", label: "URL GitHub", type: "text" },
      { name: "featured", label: "Kartu unggulan (lebar penuh)", type: "bool" },
      { name: "has_thumb", label: "Punya thumbnail", type: "bool" },
      { name: "sort", label: "Urutan", type: "number" },
    ],
  },
  {
    key: "case-study",
    table: "case_study",
    label: "Case study",
    kind: "singleton",
    fields: [
      { name: "project_slug", label: "Slug proyek", type: "text" },
      bi("heading", "Judul", "textarea"),
      {
        name: "facts",
        label: "Fakta",
        type: "json",
        hint: '[{"label":"ROLE","value_en":"…","value_id":"…"}]',
      },
      {
        name: "image_paths",
        label: "Screenshot (3 path)",
        type: "array",
        hint: "Baris 1 = gambar besar, baris 2-3 = thumbnail",
      },
    ],
  },
  {
    key: "research",
    table: "research",
    label: "Research",
    kind: "singleton",
    fields: [
      { name: "badge", label: "Badge", type: "text" },
      { name: "title", label: "Judul paper", type: "textarea" },
      bi("body", "Deskripsi", "textarea"),
      {
        name: "metrics",
        label: "Metrik",
        type: "json",
        hint: '[{"label":"F1-SCORE","value":"0.5809 → 0.5946"}]',
      },
    ],
  },
  {
    key: "experiences",
    table: "experiences",
    label: "Experience",
    kind: "collection",
    titleField: "role_en",
    fields: [
      bi("period", "Periode"),
      bi("role", "Jabatan & organisasi"),
      bi("body", "Deskripsi", "textarea"),
      { name: "sort", label: "Urutan", type: "number" },
    ],
  },
  {
    key: "skills",
    table: "skill_groups",
    label: "Skills & tools",
    kind: "collection",
    titleField: "name_en",
    fields: [
      bi("name", "Nama grup"),
      { name: "items", label: "Item", type: "array" },
      { name: "accent", label: "Chip beraksen", type: "bool" },
      { name: "sort", label: "Urutan", type: "number" },
    ],
  },
  {
    key: "posts",
    table: "posts",
    label: "Writing",
    kind: "collection",
    titleField: "title_en",
    fields: [
      bi("category", "Kategori"),
      bi("title", "Judul"),
      { name: "published", label: "Tampilkan", type: "bool" },
      { name: "sort", label: "Urutan", type: "number" },
    ],
  },
];

export function getTableDef(key: string): TableDef | undefined {
  return TABLES.find((t) => t.key === key);
}

/** Field bilingual mengembang jadi dua kolom nyata. */
export function columnsOf(def: TableDef): string[] {
  return def.fields.flatMap((f) =>
    f.bilingual ? [`${f.name}_en`, `${f.name}_id`] : [f.name],
  );
}
