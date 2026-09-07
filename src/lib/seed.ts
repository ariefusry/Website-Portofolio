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
      title: "Room Management System",
      summary: {
        en: "Room booking for PT Pos Indonesia: a Laravel web app and a Flutter app, two independent clients on one Supabase backend.",
        id: "Booking ruangan untuk PT Pos Indonesia: aplikasi web Laravel dan aplikasi Flutter, dua klien independen di satu backend Supabase.",
      },
      badges: ["PT POS INDONESIA"],
      accentBadge: false,
      tech: ["Laravel", "Flutter", "Supabase", "PostgreSQL", "Tailwind", "Firebase"],
      imageUrl: null,
      githubUrl: null,
      liveUrl: null,
      role: { en: "", id: "" },
      status: { en: "", id: "" },
      overview: {
        en: "Staff browse rooms, check availability per time slot, and submit a booking with date, time, purpose and headcount; an admin approves or rejects it with a reason. On the day, the user checks in with a photo, and every booking feeds a usage dashboard broken down by period and division. The web and mobile apps are not two systems — they are two front-ends speaking directly to the same Supabase Postgres with an identical schema, so Laravel serves no API to Flutter. Edge Functions in Deno handle check-in reminders, photo cleanup and notification triggers into Firebase Cloud Messaging.",
        id: "Karyawan melihat daftar ruangan, mengecek ketersediaan per slot waktu, dan mengajukan booking berisi tanggal, jam, keperluan, dan jumlah peserta; admin menyetujui atau menolak beserta alasannya. Pada hari pemakaian, user check-in dengan foto, dan setiap booking mengisi dashboard analitik pemakaian per periode dan per divisi. Web dan mobile bukan dua sistem terpisah — keduanya front-end yang bicara langsung ke Supabase Postgres yang sama dengan skema identik, jadi Laravel tidak menyediakan API untuk Flutter. Edge Function berbasis Deno menangani reminder check-in, cleanup foto, dan trigger notifikasi ke Firebase Cloud Messaging.",
      },
      facts: [
        { label: "ROLE", value: { en: "Fullstack developer", id: "Fullstack developer" } },
        {
          label: "SCOPE",
          value: {
            en: "Laravel web + Flutter app, admin and user roles",
            id: "Web Laravel + aplikasi Flutter, peran admin dan user",
          },
        },
        {
          label: "ARCHITECTURE",
          value: {
            en: "Two clients, one Supabase Postgres — no API between them",
            id: "Dua klien, satu Supabase Postgres — tanpa API di antaranya",
          },
        },
        {
          label: "BACKEND",
          value: {
            en: "Supabase Postgres, Storage, Deno Edge Functions",
            id: "Supabase Postgres, Storage, Edge Function Deno",
          },
        },
        {
          label: "STATUS",
          value: {
            en: "Mobile test-ready, web at roughly 70%",
            id: "Mobile siap uji, web sekitar 70%",
          },
        },
      ],
      imageUrls: [],
      highlights: {
        en: [
          "One schema, two front-ends: Laravel 12 with Blade and Tailwind, Flutter across Android, iOS and desktop, both talking to Supabase directly rather than through an API layer.",
          "Booking lifecycle end to end: availability per time slot, approval or rejection with a reason, cancellation, and a photo check-in on the day of use.",
          "Deno Edge Functions for the work that cannot live in a client: check-in reminders, storage cleanup, and notification triggers into Firebase Cloud Messaging and OneSignal.",
          "Usage analytics for admins — room occupancy by period and by division, drawn from the same booking records.",
        ],
        id: [
          "Satu skema, dua front-end: Laravel 12 dengan Blade dan Tailwind, Flutter untuk Android, iOS, dan desktop, keduanya bicara langsung ke Supabase tanpa lapisan API.",
          "Siklus booking utuh: ketersediaan per slot waktu, persetujuan atau penolakan beserta alasan, pembatalan, dan check-in berfoto di hari pemakaian.",
          "Edge Function Deno untuk pekerjaan yang tidak bisa tinggal di klien: reminder check-in, cleanup storage, dan trigger notifikasi ke Firebase Cloud Messaging dan OneSignal.",
          "Analitik pemakaian untuk admin — okupansi ruangan per periode dan per divisi, dari catatan booking yang sama.",
        ],
      },
      featured: false,
      hasThumb: true,
    },
    {
      id: "autentik",
      slug: "autentik",
      title: "AUTENTIK",
      summary: {
        en: "AI verification of student activity certificates: dual OCR, a font classifier, and Gemini cross-checking behind a Laravel + FastAPI monorepo.",
        id: "Verifikasi sertifikat kegiatan mahasiswa berbasis AI: OCR ganda, klasifikasi font, dan cross-check Gemini di balik monorepo Laravel + FastAPI.",
      },
      badges: ["PROJECT MANAGER"],
      accentBadge: false,
      tech: ["Laravel", "FastAPI", "MySQL", "Docker", "Nginx", "PyTorch", "ONNX"],
      imageUrl: null,
      githubUrl: null,
      liveUrl: null,
      role: { en: "", id: "" },
      status: { en: "", id: "" },
      overview: {
        en: "A student uploads an activity certificate, Laravel stores the record, and a FastAPI service reads the file end to end: OpenCV preprocessing, EasyOCR for a fast first pass with TrOCR re-reading low-confidence keywords, an EfficientNet-B3 font classifier exported to ONNX, then fuzzy matching against the event data plus a Google Custom Search and Gemini cross-check of whether the event exists at all. The final score and both result sets come back to Laravel and land on the certificate page. Two services, one Docker Compose stack behind Nginx.",
        id: "Mahasiswa mengunggah sertifikat kegiatan, Laravel menyimpan record-nya, lalu service FastAPI membaca berkasnya dari hulu ke hilir: preprocessing OpenCV, EasyOCR untuk pembacaan cepat dengan TrOCR membaca ulang keyword ber-confidence rendah, klasifikasi font EfficientNet-B3 yang di-export ke ONNX, lalu fuzzy matching terhadap data kegiatan plus cross-check Google Custom Search dan Gemini soal apakah kegiatannya benar-benar ada. Skor akhir dan kedua set hasil kembali ke Laravel dan tampil di halaman sertifikat. Dua service, satu stack Docker Compose di balik Nginx.",
      },
      facts: [
        { label: "ROLE", value: { en: "Project manager", id: "Project manager" } },
        {
          label: "ARCHITECTURE",
          value: {
            en: "Laravel 12 + FastAPI, Docker Compose behind Nginx",
            id: "Laravel 12 + FastAPI, Docker Compose di balik Nginx",
          },
        },
        {
          label: "OCR",
          value: {
            en: "EasyOCR first pass, TrOCR for precision",
            id: "EasyOCR pembacaan awal, TrOCR untuk presisi",
          },
        },
        {
          label: "MODEL",
          value: {
            en: "EfficientNet-B3 font classifier, 3,473 classes, ONNX Runtime",
            id: "Klasifikasi font EfficientNet-B3, 3.473 kelas, ONNX Runtime",
          },
        },
      ],
      imageUrls: [],
      highlights: {
        en: [
          "Dual OCR: EasyOCR sweeps the document, TrOCR (trocr-base-printed) re-reads the keywords the first pass was unsure about.",
          "Font forensics: EfficientNet-B3 fine-tuned over 3,473 Google Fonts classes and exported to ONNX, checking the certificate typeface against the issuer template.",
          "Content verification: rapidfuzz matching against event and participant records, then Google Custom Search plus Gemini 2.5 Flash judging whether the activity actually took place.",
          "One final score per certificate, composed from the fuzzy match and the AI verdict, stored alongside the raw OCR and analysis results.",
        ],
        id: [
          "OCR ganda: EasyOCR menyapu seluruh dokumen, TrOCR (trocr-base-printed) membaca ulang keyword yang confidence-nya rendah.",
          "Forensik font: EfficientNet-B3 di-finetune pada 3.473 kelas Google Fonts dan di-export ke ONNX, mencocokkan tipografi sertifikat dengan template penyelenggara.",
          "Verifikasi konten: pencocokan rapidfuzz terhadap data kegiatan dan peserta, lalu Google Custom Search plus Gemini 2.5 Flash menilai apakah kegiatannya memang berlangsung.",
          "Satu skor akhir per sertifikat, gabungan fuzzy match dan putusan AI, disimpan bersama hasil OCR dan analisis mentahnya.",
        ],
      },
      featured: false,
      hasThumb: true,
    },
    {
      id: "flexitask",
      slug: "flexitask",
      title: "FlexiTask",
      summary: {
        en: "Flutter task manager with reminders and a chatbot that answers questions straight from Firestore. Built the frontend.",
        id: "Task manager Flutter dengan pengingat dan chatbot yang menjawab langsung dari Firestore. Saya mengerjakan frontend-nya.",
      },
      badges: ["TEAM · 2025"],
      accentBadge: false,
      tech: ["Flutter", "Dart", "Firebase", "Ollama"],
      imageUrl: null,
      githubUrl: "https://github.com/MaNdeZZZ/FlexiTask_Mobile",
      liveUrl: null,
      role: { en: "", id: "" },
      status: { en: "", id: "" },
      overview: {
        en: "Tasks carry a due date, a priority and a colour, group themselves into Today / Tomorrow / later, and flip to overdue on a ten-second timer without a refresh. Each one can schedule its own local notification, styled by priority. The Task Assistant answers questions like \"what is due today\" or \"what is overdue\" by querying Firestore directly, and falls back to an external LLM over REST for anything conversational. I worked on the frontend: a page transition system written from scratch rather than pulled from a router package, a central theme file that keeps colour, type and button styles consistent across every screen, and a reactive UI driven by Firestore streams with no external state management library.",
        id: "Setiap task punya due date, prioritas, dan warna, mengelompokkan diri jadi Hari Ini / Besok / berikutnya, dan berubah jadi overdue lewat timer sepuluh detik tanpa perlu refresh. Masing-masing bisa menjadwalkan local notification sendiri dengan gaya berbeda per prioritas. Task Assistant menjawab pertanyaan seperti \"apa yang jatuh tempo hari ini\" atau \"mana yang overdue\" dengan query langsung ke Firestore, dan jatuh ke LLM eksternal lewat REST untuk percakapan umum. Saya mengerjakan frontend-nya: sistem transisi halaman yang ditulis sendiri alih-alih memakai package router, satu file tema terpusat yang menjaga warna, tipografi, dan gaya tombol konsisten di semua layar, serta UI reaktif dari stream Firestore tanpa state management library eksternal.",
      },
      facts: [
        { label: "ROLE", value: { en: "Frontend developer", id: "Frontend developer" } },
        {
          label: "STACK",
          value: {
            en: "Flutter · Firestore · Firebase Auth",
            id: "Flutter · Firestore · Firebase Auth",
          },
        },
        {
          label: "STATE",
          value: {
            en: "Firestore streams, no state library",
            id: "Stream Firestore, tanpa state library",
          },
        },
        {
          label: "ASSISTANT",
          value: {
            en: "Firestore queries, external LLM fallback",
            id: "Query Firestore, fallback LLM eksternal",
          },
        },
      ],
      imageUrls: [],
      highlights: {
        en: [
          "Page transitions written by hand — fade-and-slide, directional slide, scale-and-elevation and dissolve — instead of a router package.",
          "One theme file for colour, typography and button styles, applied across every screen with a custom bottom navigation and the Lexend typeface.",
          "Reactive lists straight off Firestore streams, with overdue state re-evaluated on a ten-second timer rather than on refresh.",
          "A task assistant that reads Firestore for anything about your own tasks and hands the rest to an external LLM over REST.",
        ],
        id: [
          "Transisi halaman ditulis tangan — fade-and-slide, slide berarah, scale-and-elevation, dan dissolve — bukan dari package router.",
          "Satu file tema untuk warna, tipografi, dan gaya tombol, dipakai di semua layar bersama bottom navigation kustom dan tipografi Lexend.",
          "Daftar reaktif langsung dari stream Firestore, dengan status overdue dihitung ulang lewat timer sepuluh detik alih-alih menunggu refresh.",
          "Task assistant yang membaca Firestore untuk apa pun soal task milikmu dan melempar sisanya ke LLM eksternal lewat REST.",
        ],
      },
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
