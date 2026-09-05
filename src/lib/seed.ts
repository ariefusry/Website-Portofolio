import type { Content } from "./types";

/**
 * Konten awal, disalin verbatim dari mock desain (Portfolio.dc.html) dan README handoff.
 * Dipakai sebagai fallback saat Supabase belum dikonfigurasi atau query gagal,
 * dan sebagai sumber untuk supabase/seed.sql.
 */
export const SEED: Content = {
  profile: {
    name: "Arief M. Usry",
    badge: {
      en: "OPEN TO ROLES — FULLSTACK · DATA · ML",
      id: "TERBUKA UNTUK — FULLSTACK · DATA · ML",
    },
    heroTitle: {
      en: "Fullstack engineer, with a second track in data and machine learning.",
      id: "Fullstack engineer, dengan jalur kedua di data dan machine learning.",
    },
    heroSub: {
      en: "Flutter, Laravel and Supabase in production. Two paid client platforms live, an internship at PT Pos Indonesia, and a thesis accepted at IC2IE 2026.",
      id: "Flutter, Laravel, dan Supabase di produksi. Dua platform klien berbayar sudah live, magang di PT Pos Indonesia, dan skripsi diterima di IC2IE 2026.",
    },
    about: {
      en: "Informatics graduate from Telkom University, GPA 3.77. I shipped a Flutter app and its Laravel web companion on one Supabase backend at PT Pos Indonesia, delivered a tourism platform alone for a paying client, and built a company profile site with one other developer. Alongside that: a year teaching operating systems labs, and a thesis on optimizing neural network architecture with the Grey Wolf Optimizer.",
      id: "Lulusan Informatika Telkom University, IPK 3.77. Saya merilis aplikasi Flutter beserta web Laravel-nya di satu backend Supabase untuk PT Pos Indonesia, mengerjakan platform pariwisata sendiri untuk klien berbayar, dan membangun situs company profile bersama satu developer lain. Di samping itu: setahun mengajar praktikum Sistem Operasi, dan skripsi optimasi arsitektur neural network dengan Grey Wolf Optimizer.",
    },
    contactHeading: {
      en: "Open to fullstack, data and ML roles.",
      id: "Terbuka untuk posisi fullstack, data, dan ML.",
    },
    contactNote: {
      en: "Bekasi, Indonesia · available immediately",
      id: "Bekasi, Indonesia · bisa mulai segera",
    },
    photoUrl: null,
    cvUrl: null,
    email: "ariefusry0@gmail.com",
    phone: "+62 858-1300-5651",
    linkedin: "linkedin.com/in/ariefusry",
    github: "github.com/ariefusry",
  },

  stats: [
    {
      id: "clients",
      value: "2",
      isNumeric: true,
      decimals: 0,
      label: {
        en: "Paid client platforms shipped",
        id: "Platform klien berbayar dirilis",
      },
    },
    {
      id: "gpa",
      value: "3.77",
      isNumeric: true,
      decimals: 2,
      label: {
        en: "GPA / 4.00 — Telkom University",
        id: "IPK / 4.00 — Telkom University",
      },
    },
    {
      id: "paper",
      value: "IC2IE 2026",
      isNumeric: false,
      decimals: 0,
      label: {
        en: "Paper accepted, IC2IE 2026",
        id: "Paper diterima, IC2IE 2026",
      },
    },
    {
      id: "projects",
      value: "6",
      isNumeric: true,
      decimals: 0,
      label: { en: "projects 2024—2026", id: "proyek 2024—2026" },
    },
  ],

  tracks: [
    {
      id: "fullstack",
      title: { en: "Fullstack engineering", id: "Fullstack engineering" },
      body: {
        en: "Flutter and Laravel apps on Supabase. Schema design, admin dashboards, deployment.",
        id: "Aplikasi Flutter dan Laravel di atas Supabase. Desain skema, dashboard admin, deployment.",
      },
      chips: ["Flutter", "Laravel", "Supabase", "PostgreSQL"],
      accent: false,
    },
    {
      id: "ml",
      title: { en: "Data & machine learning", id: "Data & machine learning" },
      body: {
        en: "Applied ML on the Tox21 dataset with TensorFlow, Scikit-learn and RDKit. Metaheuristic architecture search.",
        id: "ML terapan pada dataset Tox21 dengan TensorFlow, Scikit-learn, dan RDKit. Pencarian arsitektur metaheuristik.",
      },
      chips: ["TensorFlow", "Scikit-learn", "Pandas", "RDKit"],
      accent: true,
    },
  ],

  projects: [
    {
      id: "indeta",
      slug: "indeta",
      title: "INDETA",
      summary: {
        en: "Tourism & UMKM platform: destinations, products, UMKM directories, travel packages, plus an admin dashboard. Schema design through deployment.",
        id: "Platform pariwisata & UMKM: destinasi, produk, direktori UMKM, paket wisata, plus dashboard admin. Dari desain skema sampai deployment.",
      },
      badges: ["PAID CLIENT", "SOLO FULLSTACK"],
      accentBadge: true,
      tech: ["Laravel", "Tailwind", "Vite", "Vercel"],
      imageUrl: null,
      githubUrl: "https://github.com/ariefusry/INDETA",
      liveUrl: null,
      role: { en: "", id: "" },
      status: { en: "", id: "" },
      overview: {
        en: "Built solo. Paid for. Live on Vercel.",
        id: "Dibangun sendiri. Dibayar. Live di Vercel.",
      },
      facts: [
        { label: "ROLE", value: { en: "Sole fullstack developer", id: "Fullstack developer tunggal" } },
        { label: "SCOPE", value: { en: "Public site + admin CMS", id: "Situs publik + CMS admin" } },
        { label: "STACK", value: { en: "Laravel · Tailwind · Vite", id: "Laravel · Tailwind · Vite" } },
        { label: "OUTCOME", value: { en: "Delivered and deployed", id: "Selesai dan ter-deploy" } },
      ],
      imageUrls: [],
      highlights: { en: [], id: [] },
      featured: false,
      hasThumb: true,
    },
    {
      id: "sugih",
      slug: "sugih",
      title: "SUGIH",
      summary: {
        en: "Kretek brand company profile. Laravel + Supabase backend for company, product and article data.",
        id: "Company profile merek kretek. Backend Laravel + Supabase untuk data perusahaan, produk, dan artikel.",
      },
      badges: ["PAID CLIENT · 2 DEVS"],
      accentBadge: true,
      tech: ["Laravel", "Supabase"],
      imageUrl: null,
      githubUrl: "https://github.com/ghazyfadhal/sugih",
      liveUrl: null,
      role: { en: "", id: "" },
      status: { en: "", id: "" },
      overview: {
        en: "SUGIH: a kretek brand company profile, built with one other developer.",
        id: "SUGIH: company profile merek kretek, dikerjakan bersama satu developer lain.",
      },
      facts: [],
      imageUrls: [],
      highlights: { en: [], id: [] },
      featured: true,
      hasThumb: true,
    },
    {
      id: "meeting-room",
      slug: "meeting-room-management",
      title: "Meeting Room Management",
      summary: {
        en: "Real-time reservations for the Cilaki and Banda offices. Flutter + Supabase.",
        id: "Reservasi real-time untuk kantor Cilaki dan Banda. Flutter + Supabase.",
      },
      badges: ["PT POS INDONESIA"],
      accentBadge: false,
      tech: [],
      imageUrl: null,
      githubUrl: null,
      liveUrl: null,
      role: { en: "", id: "" },
      status: { en: "", id: "" },
      overview: { en: "", id: "" },
      facts: [],
      imageUrls: [],
      highlights: { en: [], id: [] },
      featured: false,
      hasThumb: true,
    },
    {
      id: "autentik",
      slug: "autentik",
      title: "AUTENTIK",
      summary: {
        en: "Certificate verification with text detection and matching on Mantranet-based infrastructure.",
        id: "Verifikasi sertifikat dengan deteksi dan pencocokan teks di atas infrastruktur berbasis Mantranet.",
      },
      badges: ["PROJECT MANAGER"],
      accentBadge: false,
      tech: [],
      imageUrl: null,
      githubUrl: null,
      liveUrl: null,
      role: { en: "", id: "" },
      status: { en: "", id: "" },
      overview: { en: "", id: "" },
      facts: [],
      imageUrls: [],
      highlights: { en: [], id: [] },
      featured: false,
      hasThumb: true,
    },
    {
      id: "flexitask",
      slug: "flexitask",
      title: "FlexiTask",
      summary: {
        en: "To-do app with a Llama-powered chatbot assistant.",
        id: "Aplikasi to-do dengan asisten chatbot berbasis Llama.",
      },
      badges: ["TEAM · 2025"],
      accentBadge: false,
      tech: [],
      imageUrl: null,
      githubUrl: "https://github.com/MaNdeZZZ/FlexiTask_Mobile",
      liveUrl: null,
      role: { en: "", id: "" },
      status: { en: "", id: "" },
      overview: { en: "", id: "" },
      facts: [],
      imageUrls: [],
      highlights: { en: [], id: [] },
      featured: false,
      hasThumb: true,
    },
  ],

  research: {
    badge: "ACCEPTED — IC2IE 2026",
    title:
      "Prediction of ER-LBD Toxicity using an ANN Optimized by Grey Wolf Optimizer",
    body: {
      en: "Tox21 dataset, 8,751 compounds at 18.6:1 imbalance. Morgan fingerprints and physicochemical descriptors reduced to 500 features by Mutual Information; SMOTETomek applied only inside the training split.",
      id: "Dataset Tox21, 8.751 senyawa dengan ketidakseimbangan 18,6:1. Morgan fingerprint dan deskriptor fisikokimia direduksi menjadi 500 fitur lewat Mutual Information; SMOTETomek hanya diterapkan di dalam data latih.",
    },
    metrics: [
      { label: "F1-SCORE", value: "0.5809 → 0.5946" },
      { label: "FALSE POSITIVES", value: "37 → 22" },
      { label: "ARCHITECTURE", value: "54-32-128" },
      { label: "FEATURES", value: "500 via MI" },
    ],
  },

  experiences: [
    {
      id: "pos",
      period: { en: "Jun — Sep 2025", id: "Jun — Sep 2025" },
      role: {
        en: "Fullstack Developer, Intern — PT Pos Indonesia (Persero)",
        id: "Fullstack Developer, Magang — PT Pos Indonesia (Persero)",
      },
      body: {
        en: "Flutter mobile app and Laravel web companion with feature parity on one Supabase backend, synced in real time. Mobile shipped test-ready; web at ~70%.",
        id: "Aplikasi mobile Flutter dan web Laravel dengan fitur setara di satu backend Supabase, tersinkron real-time. Mobile siap uji; web sekitar 70%.",
      },
    },
    {
      id: "lab",
      period: { en: "Feb 2025 — Jan 2026", id: "Feb 2025 — Jan 2026" },
      role: {
        en: "Operating System Lab Assistant — Telkom University",
        id: "Asisten Praktikum Sistem Operasi — Telkom University",
      },
      body: {
        en: "Led labs on process management, memory, file systems and synchronization; evaluated assignments and projects.",
        id: "Memandu praktikum manajemen proses, memori, sistem berkas, dan sinkronisasi; menilai tugas dan proyek.",
      },
    },
    {
      id: "pkkmb",
      period: { en: "Jun — Sep 2024", id: "Jun — Sep 2024" },
      role: {
        en: "Evaluation Team — PKKMB 2024 Committee",
        id: "Tim Evaluasi — Panitia PKKMB 2024",
      },
      body: {
        en: "Student grouping and liaison assignment, Convention Hall seating plan, Student Fair timetable.",
        id: "Pengelompokan mahasiswa dan penugasan liaison, denah tempat duduk Convention Hall, jadwal Student Fair.",
      },
    },
  ],

  skillGroups: [
    {
      id: "engineering",
      name: { en: "Engineering", id: "Engineering" },
      items: [
        "Flutter",
        "Dart",
        "Laravel",
        "PHP",
        "Supabase",
        "PostgreSQL",
        "MySQL",
        "REST API",
        "Golang",
        "Git",
        "Linux",
      ],
      accent: false,
    },
    {
      id: "data",
      name: { en: "Data & machine learning", id: "Data & machine learning" },
      items: [
        "Python",
        "TensorFlow / Keras",
        "Scikit-learn",
        "Pandas",
        "NumPy",
        "RDKit",
        "NiaPy",
      ],
      accent: true,
    },
    {
      id: "tools",
      name: { en: "Tools", id: "Tools" },
      items: [
        "Figma",
        "VS Code",
        "Android Studio",
        "Vercel",
        "Jupyter",
        "Claude Code",
        "Cursor",
        "Copilot",
      ],
      accent: false,
    },
  ],


  settings: {
    defaultLang: "EN",
  },
};
