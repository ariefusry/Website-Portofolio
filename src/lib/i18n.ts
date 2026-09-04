import type { Bi, Lang } from "./types";

/** Ambil satu bahasa dari nilai bilingual. */
export function pick(value: Bi, lang: Lang): string {
  return lang === "ID" ? value.id : value.en;
}

/** String UI statis: label, eyebrow, tombol. Konten dinamis datang dari Supabase. */
export const UI = {
  nav: {
    about: { en: "About", id: "Tentang" },
    work: { en: "Work", id: "Karya" },
    research: { en: "Research", id: "Riset" },
    experience: { en: "Experience", id: "Pengalaman" },
    writing: { en: "Writing", id: "Tulisan" },
  },
  hire: { en: "Hire me", id: "Rekrut saya" },
  menu: { en: "Menu", id: "Menu" },
  closeMenu: { en: "Close menu", id: "Tutup menu" },
  ctaWork: { en: "View selected work", id: "Lihat karya terpilih" },
  ctaCv: { en: "Download CV (PDF)", id: "Unduh CV (PDF)" },
  photoAlt: { en: "Profile photo", id: "Foto profil" },
  photoPlaceholder: { en: "[ profile photo — 4:5 ]", id: "[ foto profil — 4:5 ]" },
  eyebrowAbout: { en: "ABOUT / TENTANG", id: "ABOUT / TENTANG" },
  eyebrowResearch: { en: "RESEARCH / RISET", id: "RESEARCH / RISET" },
  eyebrowExperience: { en: "EXPERIENCE / PENGALAMAN", id: "EXPERIENCE / PENGALAMAN" },
  eyebrowSkills: { en: "SKILLS & TOOLS", id: "SKILLS & TOOLS" },
  trackLabel: { en: "Two tracks", id: "Dua jalur" },
  projTitle: { en: "Selected work", id: "Karya terpilih" },
  projRange: { en: "2024 — 2026", id: "2024 — 2026" },
  caseStudy: { en: "Read case study", id: "Baca studi kasus" },
  github: { en: "GitHub ↗", id: "GitHub ↗" },
  writingTitle: { en: "Writing", id: "Tulisan" },
  writingNote: {
    en: "Notes on building, in progress",
    id: "Catatan proses membangun, berjalan",
  },
  screenshotOf: { en: "screenshot", id: "screenshot" },
  adminDashboard: { en: "admin dashboard", id: "dashboard admin" },
  switchLang: { en: "Switch language", id: "Ganti bahasa" },
} satisfies Record<string, Bi | Record<string, Bi>>;

export type Ui = typeof UI;
