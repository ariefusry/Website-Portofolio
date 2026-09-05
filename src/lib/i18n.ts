import type { Bi, Lang } from "./types";

/** Ambil satu bahasa dari nilai bilingual. */
export function pick(value: Bi, lang: Lang): string {
  return lang === "ID" ? value.id : value.en;
}

/** String UI statis: label, eyebrow, tombol. Konten dinamis datang dari Supabase. */
export const UI = {
  nav: {
    about: { en: "About", id: "Tentang" },
    projects: { en: "Projects", id: "Proyek" },
    research: { en: "Research", id: "Riset" },
    experience: { en: "Experience", id: "Pengalaman" },
  },
  hire: { en: "Hire me", id: "Rekrut saya" },
  menu: { en: "Menu", id: "Menu" },
  closeMenu: { en: "Close menu", id: "Tutup menu" },
  ctaWork: { en: "View projects", id: "Lihat proyek" },
  ctaCv: { en: "Download CV (PDF)", id: "Unduh CV (PDF)" },
  photoAlt: { en: "Profile photo", id: "Foto profil" },
  photoPlaceholder: { en: "[ profile photo — 4:5 ]", id: "[ foto profil — 4:5 ]" },
  eyebrowAbout: { en: "ABOUT / TENTANG", id: "ABOUT / TENTANG" },
  eyebrowResearch: { en: "RESEARCH / RISET", id: "RESEARCH / RISET" },
  eyebrowExperience: { en: "EXPERIENCE / PENGALAMAN", id: "EXPERIENCE / PENGALAMAN" },
  eyebrowSkills: { en: "SKILLS & TOOLS", id: "SKILLS & TOOLS" },
  trackLabel: { en: "Two tracks", id: "Dua jalur" },
  projTitle: { en: "Projects", id: "Proyek" },
  projLead: {
    en: "Every project opens a page with the role, stack and outcome behind it.",
    id: "Tiap proyek punya halaman berisi peran, stack, dan hasilnya.",
  },
  projRange: { en: "2024 — 2026", id: "2024 — 2026" },
  viewProject: { en: "View project", id: "Lihat proyek" },
  featuredBuild: { en: "Featured build", id: "Karya sorotan" },
  readCaseStudy: { en: "Read case study", id: "Baca studi kasus" },
  exploreProjects: { en: "Explore all projects", id: "Jelajahi semua proyek" },
  selectedProjects: { en: "Selected Projects", id: "Proyek Terpilih" },
  selectedProjectsLead: {
    en: "Web apps and platforms I have designed, built and shipped — spanning fullstack engineering, data and machine learning.",
    id: "Aplikasi dan platform web yang saya rancang, bangun, dan rilis — mencakup fullstack engineering, data, dan machine learning.",
  },
  backHome: { en: "Back to home", id: "Kembali ke beranda" },
  pagination: { en: "Pagination", id: "Paginasi" },
  nextPage: { en: "Next", id: "Berikutnya" },
  prevPage: { en: "Previous", id: "Sebelumnya" },
  backToProjects: { en: "Back to projects", id: "Kembali ke proyek" },
  overview: { en: "Overview", id: "Ringkasan" },
  highlights: { en: "What I did", id: "Yang saya kerjakan" },
  gallery: { en: "Gallery", id: "Galeri" },
  notFound: {
    en: "That project does not exist.",
    id: "Proyek itu tidak ada.",
  },
  visitSite: { en: "Visit site ↗", id: "Kunjungi situs ↗" },
  github: { en: "GitHub ↗", id: "GitHub ↗" },
  screenshotOf: { en: "screenshot", id: "screenshot" },
  adminDashboard: { en: "admin dashboard", id: "dashboard admin" },
  switchLang: { en: "Switch language", id: "Ganti bahasa" },
  themeToDark: { en: "Switch to dark theme", id: "Ganti ke tema gelap" },
  themeToLight: { en: "Switch to light theme", id: "Ganti ke tema terang" },
  skillsRegion: { en: "Skills and tools", id: "Skill dan tools" },
  skillsShowAll: { en: "Show all", id: "Tampilkan semua" },
  skillsShowMarquee: { en: "Back to the reel", id: "Kembali ke pita" },
  footerNavigate: { en: "Navigate", id: "Navigasi" },
  footerContact: { en: "Contact", id: "Kontak" },
  footerElsewhere: { en: "Elsewhere", id: "Tautan lain" },
  emailLabel: { en: "Email", id: "Email" },
  phoneLabel: { en: "Phone", id: "Telepon" },
  rightsReserved: { en: "All rights reserved.", id: "Hak cipta dilindungi." },
} satisfies Record<string, Bi | Record<string, Bi>>;

export type Ui = typeof UI;
