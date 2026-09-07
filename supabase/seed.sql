-- =============================================================================
-- Isi awal, cocok dengan src/lib/seed.ts. Jalankan setelah schema.sql.
-- Aman dijalankan ulang (upsert per baris).
-- =============================================================================

insert into public.profile (
  id, name, badge_en, badge_id, hero_title_en, hero_title_id,
  hero_sub_en, hero_sub_id, about_en, about_id,
  contact_heading_en, contact_heading_id, contact_note_en, contact_note_id,
  email, phone, linkedin, github
) values (
  1,
  'Arief M. Usry',
  'OPEN TO ROLES — FULLSTACK · DATA · ML',
  'TERBUKA UNTUK — FULLSTACK · DATA · ML',
  'Fullstack engineer, with a second track in data and machine learning.',
  'Fullstack engineer, dengan jalur kedua di data dan machine learning.',
  'Flutter, Laravel and Supabase in production. Two paid client platforms live, an internship at PT Pos Indonesia, and a thesis accepted at IC2IE 2026.',
  'Flutter, Laravel, dan Supabase di produksi. Dua platform klien berbayar sudah live, magang di PT Pos Indonesia, dan skripsi diterima di IC2IE 2026.',
  'Informatics graduate from Telkom University, GPA 3.77. I shipped a Flutter app and its Laravel web companion on one Supabase backend at PT Pos Indonesia, delivered a tourism platform alone for a paying client, and built a company profile site with one other developer. Alongside that: a year teaching operating systems labs, and a thesis on optimizing neural network architecture with the Grey Wolf Optimizer.',
  'Lulusan Informatika Telkom University, IPK 3.77. Saya merilis aplikasi Flutter beserta web Laravel-nya di satu backend Supabase untuk PT Pos Indonesia, mengerjakan platform pariwisata sendiri untuk klien berbayar, dan membangun situs company profile bersama satu developer lain. Di samping itu: setahun mengajar praktikum Sistem Operasi, dan skripsi optimasi arsitektur neural network dengan Grey Wolf Optimizer.',
  'Open to fullstack, data and ML roles.',
  'Terbuka untuk posisi fullstack, data, dan ML.',
  'Bekasi, Indonesia · available immediately',
  'Bekasi, Indonesia · bisa mulai segera',
  'ariefusry0@gmail.com',
  '+62 858-1300-5651',
  'linkedin.com/in/ariefusry',
  'github.com/ariefusry'
)
on conflict (id) do update set
  name = excluded.name,
  badge_en = excluded.badge_en, badge_id = excluded.badge_id,
  hero_title_en = excluded.hero_title_en, hero_title_id = excluded.hero_title_id,
  hero_sub_en = excluded.hero_sub_en, hero_sub_id = excluded.hero_sub_id,
  about_en = excluded.about_en, about_id = excluded.about_id,
  contact_heading_en = excluded.contact_heading_en,
  contact_heading_id = excluded.contact_heading_id,
  contact_note_en = excluded.contact_note_en, contact_note_id = excluded.contact_note_id,
  email = excluded.email, phone = excluded.phone,
  linkedin = excluded.linkedin, github = excluded.github;

insert into public.site_settings (id, default_lang)
values (1, 'EN')
on conflict (id) do nothing;

insert into public.stats (id, value, is_numeric, decimals, label_en, label_id, sort) values
  ('clients',  '2',          true,  0, 'Paid client platforms shipped', 'Platform klien berbayar dirilis', 1),
  ('gpa',      '3.77',       true,  2, 'GPA / 4.00 — Telkom University', 'IPK / 4.00 — Telkom University', 2),
  ('paper',    'IC2IE 2026', false, 0, 'Paper accepted, IC2IE 2026', 'Paper diterima, IC2IE 2026', 3),
  ('projects', '6',          true,  0, 'projects 2024—2026', 'proyek 2024—2026', 4)
on conflict (id) do update set
  value = excluded.value, is_numeric = excluded.is_numeric, decimals = excluded.decimals,
  label_en = excluded.label_en, label_id = excluded.label_id, sort = excluded.sort;

insert into public.tracks (id, title_en, title_id, body_en, body_id, chips, accent, sort) values
  ('fullstack', 'Fullstack engineering', 'Fullstack engineering',
   'Flutter and Laravel apps on Supabase. Schema design, admin dashboards, deployment.',
   'Aplikasi Flutter dan Laravel di atas Supabase. Desain skema, dashboard admin, deployment.',
   array['Flutter','Laravel','Supabase','PostgreSQL'], false, 1),
  ('ml', 'Data & machine learning', 'Data & machine learning',
   'Applied ML on the Tox21 dataset with TensorFlow, Scikit-learn and RDKit. Metaheuristic architecture search.',
   'ML terapan pada dataset Tox21 dengan TensorFlow, Scikit-learn, dan RDKit. Pencarian arsitektur metaheuristik.',
   array['TensorFlow','Scikit-learn','Pandas','RDKit'], true, 2)
on conflict (id) do update set
  title_en = excluded.title_en, title_id = excluded.title_id,
  body_en = excluded.body_en, body_id = excluded.body_id,
  chips = excluded.chips, accent = excluded.accent, sort = excluded.sort;

insert into public.projects
  (id, slug, title, summary_en, summary_id, badges, accent_badge, tech,
   featured, has_thumb, overview_en, overview_id, facts,
   highlights_en, highlights_id, sort)
values
  ('indeta', 'indeta', 'INDETA',
   'Tourism & UMKM platform: destinations, products, UMKM directories, travel packages, plus an admin dashboard. Schema design through deployment.',
   'Platform pariwisata & UMKM: destinasi, produk, direktori UMKM, paket wisata, plus dashboard admin. Dari desain skema sampai deployment.',
   array['PAID CLIENT','SOLO FULLSTACK'], true, array['Laravel','Tailwind','Vite','Vercel'],
   false, true,
   'Built solo. Paid for. Live on Vercel.',
   'Dibangun sendiri. Dibayar. Live di Vercel.',
   '[{"label":"ROLE","value_en":"Sole fullstack developer","value_id":"Fullstack developer tunggal"},
     {"label":"SCOPE","value_en":"Public site + admin CMS","value_id":"Situs publik + CMS admin"},
     {"label":"STACK","value_en":"Laravel · Tailwind · Vite","value_id":"Laravel · Tailwind · Vite"},
     {"label":"OUTCOME","value_en":"Delivered and deployed","value_id":"Selesai dan ter-deploy"}]'::jsonb,
   array[]::text[], array[]::text[],
   1),
  ('sugih', 'sugih', 'SUGIH',
   'Kretek brand company profile. Laravel + Supabase backend for company, product and article data.',
   'Company profile merek kretek. Backend Laravel + Supabase untuk data perusahaan, produk, dan artikel.',
   array['PAID CLIENT · 2 DEVS'], true, array['Laravel','Supabase'], true, true,
   'SUGIH: a kretek brand company profile, built with one other developer.',
   'SUGIH: company profile merek kretek, dikerjakan bersama satu developer lain.',
   '[]'::jsonb, array[]::text[], array[]::text[], 2),
  ('meeting-room', 'meeting-room-management', 'Room Management System',
   'Room booking for PT Pos Indonesia: a Laravel web app and a Flutter app, two independent clients on one Supabase backend.',
   'Booking ruangan untuk PT Pos Indonesia: aplikasi web Laravel dan aplikasi Flutter, dua klien independen di satu backend Supabase.',
   array['PT POS INDONESIA'], false,
   array['Laravel','Flutter','Supabase','PostgreSQL','Tailwind','Firebase'], false, true,
   'Staff browse rooms, check availability per time slot, and submit a booking with date, time, purpose and headcount; an admin approves or rejects it with a reason. On the day, the user checks in with a photo, and every booking feeds a usage dashboard broken down by period and division. The web and mobile apps are not two systems — they are two front-ends speaking directly to the same Supabase Postgres with an identical schema, so Laravel serves no API to Flutter. Edge Functions in Deno handle check-in reminders, photo cleanup and notification triggers into Firebase Cloud Messaging.',
   'Karyawan melihat daftar ruangan, mengecek ketersediaan per slot waktu, dan mengajukan booking berisi tanggal, jam, keperluan, dan jumlah peserta; admin menyetujui atau menolak beserta alasannya. Pada hari pemakaian, user check-in dengan foto, dan setiap booking mengisi dashboard analitik pemakaian per periode dan per divisi. Web dan mobile bukan dua sistem terpisah — keduanya front-end yang bicara langsung ke Supabase Postgres yang sama dengan skema identik, jadi Laravel tidak menyediakan API untuk Flutter. Edge Function berbasis Deno menangani reminder check-in, cleanup foto, dan trigger notifikasi ke Firebase Cloud Messaging.',
   '[{"label":"ROLE","value_en":"Fullstack developer","value_id":"Fullstack developer"},
            {"label":"SCOPE","value_en":"Laravel web + Flutter app, admin and user roles","value_id":"Web Laravel + aplikasi Flutter, peran admin dan user"},
     {"label":"ARCHITECTURE","value_en":"Two clients, one Supabase Postgres — no API between them","value_id":"Dua klien, satu Supabase Postgres — tanpa API di antaranya"},
     {"label":"BACKEND","value_en":"Supabase Postgres, Storage, Deno Edge Functions","value_id":"Supabase Postgres, Storage, Edge Function Deno"},
     {"label":"STATUS","value_en":"Mobile test-ready, web at roughly 70%","value_id":"Mobile siap uji, web sekitar 70%"}]'::jsonb,
   array[
     'One schema, two front-ends: Laravel 12 with Blade and Tailwind, Flutter across Android, iOS and desktop, both talking to Supabase directly rather than through an API layer.',
     'Booking lifecycle end to end: availability per time slot, approval or rejection with a reason, cancellation, and a photo check-in on the day of use.',
     'Deno Edge Functions for the work that cannot live in a client: check-in reminders, storage cleanup, and notification triggers into Firebase Cloud Messaging and OneSignal.',
     'Usage analytics for admins — room occupancy by period and by division, drawn from the same booking records.'
   ],
   array[
     'Satu skema, dua front-end: Laravel 12 dengan Blade dan Tailwind, Flutter untuk Android, iOS, dan desktop, keduanya bicara langsung ke Supabase tanpa lapisan API.',
     'Siklus booking utuh: ketersediaan per slot waktu, persetujuan atau penolakan beserta alasan, pembatalan, dan check-in berfoto di hari pemakaian.',
     'Edge Function Deno untuk pekerjaan yang tidak bisa tinggal di klien: reminder check-in, cleanup storage, dan trigger notifikasi ke Firebase Cloud Messaging dan OneSignal.',
     'Analitik pemakaian untuk admin — okupansi ruangan per periode dan per divisi, dari catatan booking yang sama.'
   ],
   3),
  ('autentik', 'autentik', 'AUTENTIK',
   'AI verification of student activity certificates: dual OCR, a font classifier, and Gemini cross-checking behind a Laravel + FastAPI monorepo.',
   'Verifikasi sertifikat kegiatan mahasiswa berbasis AI: OCR ganda, klasifikasi font, dan cross-check Gemini di balik monorepo Laravel + FastAPI.',
   array['PROJECT MANAGER'], false,
   array['Laravel','FastAPI','MySQL','Docker','Nginx','PyTorch','ONNX'], false, true,
   'A student uploads an activity certificate, Laravel stores the record, and a FastAPI service reads the file end to end: OpenCV preprocessing, EasyOCR for a fast first pass with TrOCR re-reading low-confidence keywords, an EfficientNet-B3 font classifier exported to ONNX, then fuzzy matching against the event data plus a Google Custom Search and Gemini cross-check of whether the event exists at all. The final score and both result sets come back to Laravel and land on the certificate page. Two services, one Docker Compose stack behind Nginx.',
   'Mahasiswa mengunggah sertifikat kegiatan, Laravel menyimpan record-nya, lalu service FastAPI membaca berkasnya dari hulu ke hilir: preprocessing OpenCV, EasyOCR untuk pembacaan cepat dengan TrOCR membaca ulang keyword ber-confidence rendah, klasifikasi font EfficientNet-B3 yang di-export ke ONNX, lalu fuzzy matching terhadap data kegiatan plus cross-check Google Custom Search dan Gemini soal apakah kegiatannya benar-benar ada. Skor akhir dan kedua set hasil kembali ke Laravel dan tampil di halaman sertifikat. Dua service, satu stack Docker Compose di balik Nginx.',
   '[{"label":"ROLE","value_en":"Project manager","value_id":"Project manager"},
     {"label":"ARCHITECTURE","value_en":"Laravel 12 + FastAPI, Docker Compose behind Nginx","value_id":"Laravel 12 + FastAPI, Docker Compose di balik Nginx"},
     {"label":"OCR","value_en":"EasyOCR first pass, TrOCR for precision","value_id":"EasyOCR pembacaan awal, TrOCR untuk presisi"},
     {"label":"MODEL","value_en":"EfficientNet-B3 font classifier, 3,473 classes, ONNX Runtime","value_id":"Klasifikasi font EfficientNet-B3, 3.473 kelas, ONNX Runtime"}]'::jsonb,
   array[
     'Dual OCR: EasyOCR sweeps the document, TrOCR (trocr-base-printed) re-reads the keywords the first pass was unsure about.',
     'Font forensics: EfficientNet-B3 fine-tuned over 3,473 Google Fonts classes and exported to ONNX, checking the certificate typeface against the issuer template.',
     'Content verification: rapidfuzz matching against event and participant records, then Google Custom Search plus Gemini 2.5 Flash judging whether the activity actually took place.',
     'One final score per certificate, composed from the fuzzy match and the AI verdict, stored alongside the raw OCR and analysis results.'
   ],
   array[
     'OCR ganda: EasyOCR menyapu seluruh dokumen, TrOCR (trocr-base-printed) membaca ulang keyword yang confidence-nya rendah.',
     'Forensik font: EfficientNet-B3 di-finetune pada 3.473 kelas Google Fonts dan di-export ke ONNX, mencocokkan tipografi sertifikat dengan template penyelenggara.',
     'Verifikasi konten: pencocokan rapidfuzz terhadap data kegiatan dan peserta, lalu Google Custom Search plus Gemini 2.5 Flash menilai apakah kegiatannya memang berlangsung.',
     'Satu skor akhir per sertifikat, gabungan fuzzy match dan putusan AI, disimpan bersama hasil OCR dan analisis mentahnya.'
   ],
   4),
  ('flexitask', 'flexitask', 'FlexiTask',
   'Flutter task manager with reminders and a chatbot that answers questions straight from Firestore. Built the frontend.',
   'Task manager Flutter dengan pengingat dan chatbot yang menjawab langsung dari Firestore. Saya mengerjakan frontend-nya.',
   array['TEAM · 2025'], false, array['Flutter','Dart','Firebase','Ollama'], false, true,
   'Tasks carry a due date, a priority and a colour, group themselves into Today / Tomorrow / later, and flip to overdue on a ten-second timer without a refresh. Each one can schedule its own local notification, styled by priority. The Task Assistant answers questions like "what is due today" or "what is overdue" by querying Firestore directly, and falls back to an external LLM over REST for anything conversational. I worked on the frontend: a page transition system written from scratch rather than pulled from a router package, a central theme file that keeps colour, type and button styles consistent across every screen, and a reactive UI driven by Firestore streams with no external state management library.',
   'Setiap task punya due date, prioritas, dan warna, mengelompokkan diri jadi Hari Ini / Besok / berikutnya, dan berubah jadi overdue lewat timer sepuluh detik tanpa perlu refresh. Masing-masing bisa menjadwalkan local notification sendiri dengan gaya berbeda per prioritas. Task Assistant menjawab pertanyaan seperti "apa yang jatuh tempo hari ini" atau "mana yang overdue" dengan query langsung ke Firestore, dan jatuh ke LLM eksternal lewat REST untuk percakapan umum. Saya mengerjakan frontend-nya: sistem transisi halaman yang ditulis sendiri alih-alih memakai package router, satu file tema terpusat yang menjaga warna, tipografi, dan gaya tombol konsisten di semua layar, serta UI reaktif dari stream Firestore tanpa state management library eksternal.',
   '[{"label":"ROLE","value_en":"Frontend developer","value_id":"Frontend developer"},
     {"label":"STACK","value_en":"Flutter · Firestore · Firebase Auth","value_id":"Flutter · Firestore · Firebase Auth"},
     {"label":"STATE","value_en":"Firestore streams, no state library","value_id":"Stream Firestore, tanpa state library"},
     {"label":"ASSISTANT","value_en":"Firestore queries, external LLM fallback","value_id":"Query Firestore, fallback LLM eksternal"}]'::jsonb,
   array[
     'Page transitions written by hand — fade-and-slide, directional slide, scale-and-elevation and dissolve — instead of a router package.',
     'One theme file for colour, typography and button styles, applied across every screen with a custom bottom navigation and the Lexend typeface.',
     'Reactive lists straight off Firestore streams, with overdue state re-evaluated on a ten-second timer rather than on refresh.',
     'A task assistant that reads Firestore for anything about your own tasks and hands the rest to an external LLM over REST.'
   ],
   array[
     'Transisi halaman ditulis tangan — fade-and-slide, slide berarah, scale-and-elevation, dan dissolve — bukan dari package router.',
     'Satu file tema untuk warna, tipografi, dan gaya tombol, dipakai di semua layar bersama bottom navigation kustom dan tipografi Lexend.',
     'Daftar reaktif langsung dari stream Firestore, dengan status overdue dihitung ulang lewat timer sepuluh detik alih-alih menunggu refresh.',
     'Task assistant yang membaca Firestore untuk apa pun soal task milikmu dan melempar sisanya ke LLM eksternal lewat REST.'
   ],
   5)
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title,
  summary_en = excluded.summary_en, summary_id = excluded.summary_id,
  badges = excluded.badges, accent_badge = excluded.accent_badge, tech = excluded.tech,
  featured = excluded.featured, has_thumb = excluded.has_thumb,
  overview_en = excluded.overview_en, overview_id = excluded.overview_id,
  facts = excluded.facts,
  highlights_en = excluded.highlights_en, highlights_id = excluded.highlights_id,
  sort = excluded.sort;

insert into public.research (id, badge, title, body_en, body_id, metrics)
values (
  1,
  'ACCEPTED — IC2IE 2026',
  'Prediction of ER-LBD Toxicity using an ANN Optimized by Grey Wolf Optimizer',
  'Tox21 dataset, 8,751 compounds at 18.6:1 imbalance. Morgan fingerprints and physicochemical descriptors reduced to 500 features by Mutual Information; SMOTETomek applied only inside the training split.',
  'Dataset Tox21, 8.751 senyawa dengan ketidakseimbangan 18,6:1. Morgan fingerprint dan deskriptor fisikokimia direduksi menjadi 500 fitur lewat Mutual Information; SMOTETomek hanya diterapkan di dalam data latih.',
  '[
    {"label":"F1-SCORE","value":"0.5809 → 0.5946"},
    {"label":"FALSE POSITIVES","value":"37 → 22"},
    {"label":"ARCHITECTURE","value":"54-32-128"},
    {"label":"FEATURES","value":"500 via MI"}
  ]'::jsonb
)
on conflict (id) do update set
  badge = excluded.badge, title = excluded.title,
  body_en = excluded.body_en, body_id = excluded.body_id, metrics = excluded.metrics;

insert into public.experiences (id, period_en, period_id, role_en, role_id, body_en, body_id, sort) values
  ('pos', 'Jun — Sep 2025', 'Jun — Sep 2025',
   'Fullstack Developer, Intern — PT Pos Indonesia (Persero)',
   'Fullstack Developer, Magang — PT Pos Indonesia (Persero)',
   'Flutter mobile app and Laravel web companion with feature parity on one Supabase backend, synced in real time. Mobile shipped test-ready; web at ~70%.',
   'Aplikasi mobile Flutter dan web Laravel dengan fitur setara di satu backend Supabase, tersinkron real-time. Mobile siap uji; web sekitar 70%.', 1),
  ('lab', 'Feb 2025 — Jan 2026', 'Feb 2025 — Jan 2026',
   'Operating System Lab Assistant — Telkom University',
   'Asisten Praktikum Sistem Operasi — Telkom University',
   'Led labs on process management, memory, file systems and synchronization; evaluated assignments and projects.',
   'Memandu praktikum manajemen proses, memori, sistem berkas, dan sinkronisasi; menilai tugas dan proyek.', 2),
  ('pkkmb', 'Jun — Sep 2024', 'Jun — Sep 2024',
   'Evaluation Team — PKKMB 2024 Committee',
   'Tim Evaluasi — Panitia PKKMB 2024',
   'Student grouping and liaison assignment, Convention Hall seating plan, Student Fair timetable.',
   'Pengelompokan mahasiswa dan penugasan liaison, denah tempat duduk Convention Hall, jadwal Student Fair.', 3)
on conflict (id) do update set
  period_en = excluded.period_en, period_id = excluded.period_id,
  role_en = excluded.role_en, role_id = excluded.role_id,
  body_en = excluded.body_en, body_id = excluded.body_id, sort = excluded.sort;

insert into public.skill_groups (id, name_en, name_id, items, accent, sort) values
  ('engineering', 'Engineering', 'Engineering',
   array['Flutter','Dart','Laravel','PHP','Supabase','PostgreSQL','MySQL','REST API','Golang','Git','Linux'],
   false, 1),
  ('data', 'Data & machine learning', 'Data & machine learning',
   array['Python','TensorFlow / Keras','Scikit-learn','Pandas','NumPy','RDKit','NiaPy'],
   true, 2),
  ('tools', 'Tools', 'Tools',
   array['Figma','VS Code','Android Studio','Vercel','Jupyter','Claude Code','Cursor','Copilot'],
   false, 3)
on conflict (id) do update set
  name_en = excluded.name_en, name_id = excluded.name_id,
  items = excluded.items, accent = excluded.accent, sort = excluded.sort;


-- Tautan repository. Hanya repo yang publik yang dipasang: repo privat akan
-- tampil sebagai 404 bagi pengunjung, yang lebih buruk daripada tanpa tautan.
update public.projects set github_url = 'https://github.com/ariefusry/INDETA'        where slug = 'indeta';
update public.projects set github_url = 'https://github.com/ghazyfadhal/sugih'       where slug = 'sugih';
update public.projects set github_url = 'https://github.com/MaNdeZZZ/FlexiTask_Mobile' where slug = 'flexitask';
