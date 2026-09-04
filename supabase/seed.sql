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
   featured, has_thumb, overview_en, overview_id, facts, sort)
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
   1),
  ('sugih', 'sugih', 'SUGIH',
   'Kretek brand company profile. Laravel + Supabase backend for company, product and article data.',
   'Company profile merek kretek. Backend Laravel + Supabase untuk data perusahaan, produk, dan artikel.',
   array['PAID CLIENT · 2 DEVS'], true, array['Laravel','Supabase'], true, true,
   'SUGIH: a kretek brand company profile, built with one other developer.',
   'SUGIH: company profile merek kretek, dikerjakan bersama satu developer lain.',
   '[]'::jsonb, 2),
  ('meeting-room', 'meeting-room-management', 'Meeting Room Management',
   'Real-time reservations for the Cilaki and Banda offices. Flutter + Supabase.',
   'Reservasi real-time untuk kantor Cilaki dan Banda. Flutter + Supabase.',
   array['PT POS INDONESIA'], false, array[]::text[], false, true, '', '', '[]'::jsonb, 3),
  ('autentik', 'autentik', 'AUTENTIK',
   'Certificate verification with text detection and matching on Mantranet-based infrastructure.',
   'Verifikasi sertifikat dengan deteksi dan pencocokan teks di atas infrastruktur berbasis Mantranet.',
   array['PROJECT MANAGER'], false, array[]::text[], false, true, '', '', '[]'::jsonb, 4),
  ('flexitask', 'flexitask', 'FlexiTask',
   'To-do app with a Llama-powered chatbot assistant.',
   'Aplikasi to-do dengan asisten chatbot berbasis Llama.',
   array['TEAM · 2025'], false, array[]::text[], false, true, '', '', '[]'::jsonb, 5)
on conflict (id) do update set
  slug = excluded.slug, title = excluded.title,
  summary_en = excluded.summary_en, summary_id = excluded.summary_id,
  badges = excluded.badges, accent_badge = excluded.accent_badge, tech = excluded.tech,
  featured = excluded.featured, has_thumb = excluded.has_thumb,
  overview_en = excluded.overview_en, overview_id = excluded.overview_id,
  facts = excluded.facts, sort = excluded.sort;

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

