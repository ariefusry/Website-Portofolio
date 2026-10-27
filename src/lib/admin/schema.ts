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
  | "json" // jsonb — diedit lewat baris-baris terstruktur (`rows`), bukan JSON mentah
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
  /**
   * `video`: diunggah apa adanya, tanpa crop.
   * `cutout`: foto hero — crop 4:5 dan PNG supaya latar transparannya ikut.
   */
  media?: "video" | "cutout";
  /** Judul kelompok; muncul sekali di atas field pertama yang membawanya. */
  section?: string;
  /** Isian pendek yang boleh berdampingan dengan isian `half` di sebelahnya. */
  half?: boolean;
  /** Kolom yang tidak diedit manual (mis. `sort`, diatur lewat seret di daftar). */
  hidden?: boolean;
  /** Untuk `array`: tampil sebagai chip yang bisa ditambah/dihapus satu per satu. */
  chips?: boolean;
  /** Untuk `json`: kolom tiap baris. Kunci tak terdaftar di data lama tetap dibawa. */
  rows?: { key: string; label: string }[];
};

export type TableDef = {
  key: string;
  table: string;
  label: string;
  kind: "singleton" | "collection";
  /** Kolom yang dipakai sebagai judul baris di halaman daftar. */
  titleField?: string;
  /** Alamat halaman publik yang memuat isi tabel ini, untuk tautan "Lihat di situs". */
  preview?: string;
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
    preview: "/",
    fields: [
      { name: "name", label: "Nama tampil", type: "text", section: "Hero" },
      bi("hero_title", "Judul hero", "textarea"),
      bi("hero_sub", "Subjudul hero", "textarea"),
      {
        name: "photo_path",
        label: "Foto profil",
        type: "asset",
        bucket: "assets",
        media: "cutout",
        hint: "PNG dengan latar sudah dihapus, rasio 4:5",
      },
      {
        name: "cv_path",
        label: "CV (PDF)",
        type: "asset",
        bucket: "documents",
        hint: "Path di bucket documents, mis. cv.pdf",
      },
      { ...bi("about", "Paragraf about", "textarea"), section: "About" },
      {
        name: "about_facts",
        label: "Fakta about",
        type: "json",
        hint: "Baris label dan isi di bawah paragraf about",
        rows: [
          { key: "label", label: "Label" },
          { key: "value_en", label: "Isi (EN)" },
          { key: "value_id", label: "Isi (ID)" },
        ],
      },
      { ...bi("contact_heading", "Judul kontak"), section: "Kontak & footer" },
      bi("contact_note", "Catatan kontak"),
      { name: "email", label: "Email", type: "text", half: true },
      { name: "phone", label: "Telepon", type: "text", half: true },
      { name: "linkedin", label: "LinkedIn", type: "text", hint: "tanpa https://", half: true },
      { name: "github", label: "GitHub", type: "text", hint: "tanpa https://", half: true },
    ],
  },
  {
    key: "settings",
    table: "site_settings",
    label: "Pengaturan situs",
    kind: "singleton",
    fields: [
      {
        name: "default_lang",
        label: "Bahasa default",
        type: "text",
        hint: "EN atau ID",
      },
    ],
  },
  // Stat strip dihapus dari beranda, jadi form-nya ikut dilepas — dashboard
  // yang menawarkan pengeditan sesuatu yang tidak tampil di mana pun cuma
  // menyesatkan. Tabel `stats` di Postgres sengaja dibiarkan utuh. Begitu juga
  // "Two tracks": diganti baris fakta di about, tabel `tracks` tetap ada.
  {
    key: "projects",
    table: "projects",
    label: "Projects",
    kind: "collection",
    titleField: "title",
    preview: "/projects",
    fields: [
      { name: "title", label: "Judul", type: "text", section: "Dasar", half: true },
      {
        name: "slug",
        label: "Slug",
        type: "text",
        hint: "alamat halaman, diisi otomatis dari judul",
        half: true,
      },
      bi("summary", "Ringkasan", "textarea"),
      bi("role", "Peran (baris di bawah judul kartu)"),
      bi("status", "Badge status", "text"),
      {
        name: "image_paths",
        label: "Galeri screenshot",
        type: "array",
        bucket: "assets",
        section: "Media",
        hint: "Bisa banyak. Seret untuk mengurutkan; foto pertama jadi gambar kartu dan gambar utama",
      },
      {
        name: "video_path",
        label: "Video (16:9, opsional)",
        type: "asset",
        bucket: "assets",
        media: "video",
        hint: "mp4/webm, maks. 50 MB",
      },
      {
        name: "github_url",
        label: "URL GitHub",
        type: "text",
        section: "Tautan",
        half: true,
      },
      { name: "live_url", label: "URL situs live", type: "text", half: true },
      {
        name: "tech",
        label: "Chip teknologi",
        type: "array",
        chips: true,
        section: "Tampilan kartu",
      },
      {
        name: "badges",
        label: "Badge (cadangan bila peran kosong)",
        type: "array",
        chips: true,
      },
      { name: "accent_badge", label: "Badge beraksen", type: "bool" },
      {
        name: "featured",
        label: "Tampilkan di Featured Build (dikeluarkan dari grid)",
        type: "bool",
      },
      {
        ...bi("overview", "Ringkasan panjang (halaman detail)", "textarea"),
        section: "Halaman detail",
      },
      {
        name: "facts",
        label: "Fakta ringkas",
        type: "json",
        rows: [
          { key: "label", label: "Label" },
          { key: "value_en", label: "Isi (EN)" },
          { key: "value_id", label: "Isi (ID)" },
        ],
      },
      bi("highlights", "Poin kontribusi", "array"),
      { name: "sort", label: "Urutan", type: "number", hidden: true },
    ],
  },
  {
    key: "research",
    table: "research",
    label: "Research",
    kind: "singleton",
    preview: "/#research",
    fields: [
      { name: "badge", label: "Badge", type: "text" },
      { name: "title", label: "Judul paper", type: "textarea" },
      bi("body", "Deskripsi", "textarea"),
      {
        name: "metrics",
        label: "Metrik",
        type: "json",
        rows: [
          { key: "label", label: "Label" },
          { key: "value", label: "Nilai" },
        ],
      },
    ],
  },
  {
    key: "experiences",
    table: "experiences",
    label: "Experience",
    kind: "collection",
    titleField: "role_en",
    preview: "/#experience",
    fields: [
      bi("period", "Periode"),
      bi("role", "Jabatan & organisasi"),
      bi("body", "Deskripsi", "textarea"),
      { name: "sort", label: "Urutan", type: "number", hidden: true },
    ],
  },
  {
    key: "skills",
    table: "skill_groups",
    label: "Skills & tools",
    kind: "collection",
    titleField: "name_en",
    preview: "/#skills",
    fields: [
      bi("name", "Nama grup"),
      { name: "items", label: "Item", type: "array", chips: true },
      { name: "sort", label: "Urutan", type: "number", hidden: true },
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
