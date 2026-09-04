export type Lang = "EN" | "ID";

/** Teks bilingual. Kedua bahasa selalu dikirim ke client supaya toggle instan. */
export type Bi = { en: string; id: string };

/** Daftar bilingual, mis. poin kontribusi. */
export type BiList = { en: string[]; id: string[] };

export type Stat = {
  id: string;
  /** Nilai akhir. Angka (di-count-up) atau teks apa adanya seperti "IC2IE 2026". */
  value: string;
  isNumeric: boolean;
  decimals: number;
  label: Bi;
};

export type Track = {
  id: string;
  title: Bi;
  body: Bi;
  chips: string[];
  accent: boolean;
};

export type ProjectFact = { label: string; value: Bi };

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: Bi;
  /** Label kecil di atas judul, mis. "PAID CLIENT", "SOLO FULLSTACK". */
  badges: string[];
  /** Badge diwarnai aksen (dipakai untuk klien berbayar). */
  accentBadge: boolean;
  tech: string[];
  imageUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  /** Kartu kecil dengan thumbnail vs kartu teks saja. */
  hasThumb: boolean;

  /* --- Isi halaman detail. Semuanya opsional: halaman detail tetap tampil
         utuh selama field ini masih kosong. --- */
  overview: Bi;
  facts: ProjectFact[];
  /** Galeri di halaman detail; item pertama jadi gambar utama. */
  imageUrls: string[];
  highlights: BiList;
};

export type Research = {
  badge: string;
  title: string;
  body: Bi;
  metrics: { label: string; value: string }[];
};

export type Experience = {
  id: string;
  period: Bi;
  role: Bi;
  body: Bi;
};

export type SkillGroup = {
  id: string;
  name: Bi;
  items: string[];
  accent: boolean;
};

export type Profile = {
  name: string;
  badge: Bi;
  heroTitle: Bi;
  heroSub: Bi;
  about: Bi;
  contactHeading: Bi;
  contactNote: Bi;
  photoUrl: string | null;
  cvUrl: string | null;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
};

export type SiteSettings = {
  defaultLang: Lang;
};

export type Content = {
  profile: Profile;
  stats: Stat[];
  tracks: Track[];
  projects: Project[];
  research: Research;
  experiences: Experience[];
  skillGroups: SkillGroup[];
  settings: SiteSettings;
};
