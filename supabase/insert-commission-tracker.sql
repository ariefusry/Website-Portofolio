-- =============================================================================
-- Insert project: Commission Tracker
-- Jalankan di Supabase → SQL Editor setelah schema.sql dan seed.sql.
-- Aman dijalankan ulang (upsert).
-- =============================================================================

insert into public.projects
  (id, slug, title, summary_en, summary_id, badges, accent_badge, tech,
   featured, has_thumb, overview_en, overview_id, facts,
   image_paths, highlights_en, highlights_id,
   github_url, live_url, sort)
values
  ('commission-tracker', 'commission-tracker', 'Commission Tracker',

   -- summary_en
   'A free web app for illustrators who take art commissions. Track every order from waiting list to delivery, see what you earned and what clients still owe, and send each client a private tracking link with their queue position and estimated finish date.',

   -- summary_id
   'Aplikasi web gratis untuk ilustrator yang menerima komisi gambar. Lacak setiap pesanan dari antrean hingga pengiriman, lihat pemasukan dan sisa tagihan, lalu kirim link tracking privat ke tiap klien berisi posisi antrean dan perkiraan selesai.',

   -- badges
   array['SOLO FULLSTACK'],

   -- accent_badge
   false,

   -- tech
   array['Next.js','React','TypeScript','Tailwind CSS','shadcn/ui','Supabase','Recharts','dnd-kit','Zod','Vitest','Vercel'],

   -- featured
   false,

   -- has_thumb
   true,

   -- overview_en
   'A commission management app built for solo illustrators who take orders through Twitter/X and Discord. The artist gets a commission list, a drag-and-drop Kanban board (Waiting list → In progress → Done), configurable order types with add-on pricing, payment tracking (unpaid / deposit / paid), and a dashboard showing income vs unpaid per day or month, late work, average turnaround, on-time rate, and income per order type — every chart has a table view and the whole dashboard filters by clicking a type or a month. Each commission gets a private tracking link the artist sends to the client: it shows the current stage, queue position, and an estimated finish date calculated from the artist''s real pace over the last 90 days, displayed as a ±25% range. The client never sees prices, other clients'' names, or contact details. Security lives in the database: every table has row-level security keyed to auth.uid(), the tracking page reads through a single Postgres function (get_tracking) rather than querying tables, and the anonymous role has no table grants at all. Prices are integer rupiah snapshots frozen at booking time, so edits to the price list never change what a client was quoted. WIP images are compressed to WebP in the browser before upload, capped at 10 per commission, and cleaned up by a daily Vercel Cron 30 days after the commission is done. Daily deadline reminders go out at 08:00 WIB through Discord webhooks, with email ready to enable. The app is free, supported by QRIS donations, fully bilingual (Indonesian and English), works as a PWA, and has 50 unit tests plus 5 SQL test suites covering RLS, saving, tracking, queue logic, and WIP images.',

   -- overview_id
   'Aplikasi manajemen komisi untuk ilustrator solo yang menerima pesanan lewat Twitter/X dan Discord. Artist mendapat daftar komisi, papan Kanban seret-lepas (Antrean → Dikerjakan → Selesai), tipe pesanan yang bisa dikonfigurasi dengan harga add-on, pelacakan pembayaran (belum bayar / DP / lunas), dan dashboard yang menampilkan pemasukan vs belum dibayar per hari atau bulan, pekerjaan terlambat, rata-rata waktu pengerjaan, tingkat tepat waktu, dan pemasukan per tipe pesanan — setiap grafik punya tampilan tabel dan seluruh dashboard bisa difilter dengan mengklik tipe atau bulan. Setiap komisi mendapat link tracking privat yang dikirim artist ke klien: menampilkan tahap saat ini, posisi antrean, dan perkiraan selesai yang dihitung dari kecepatan nyata artist selama 90 hari terakhir sebagai rentang ±25%. Klien tidak pernah melihat harga, nama klien lain, atau detail kontak. Keamanan ada di database: setiap tabel punya row-level security berbasis auth.uid(), halaman tracking membaca lewat satu fungsi Postgres (get_tracking) alih-alih query tabel, dan role anonymous tidak punya akses tabel sama sekali. Harga disimpan sebagai integer rupiah yang di-snapshot saat pemesanan, jadi perubahan daftar harga tidak mengubah harga yang sudah disepakati klien. Gambar WIP dikompres ke WebP di browser sebelum diunggah, dibatasi 10 per komisi, dan dibersihkan Vercel Cron harian 30 hari setelah komisi selesai. Pengingat deadline harian dikirim pukul 08:00 WIB lewat webhook Discord, dengan email siap diaktifkan. Aplikasi gratis, didukung donasi QRIS, dwibahasa penuh (Indonesia dan Inggris), berfungsi sebagai PWA, dan punya 50 unit test plus 5 suite tes SQL yang mencakup RLS, penyimpanan, tracking, logika antrean, dan gambar WIP.',

   -- facts
   '[{"label":"ROLE","value_en":"Solo fullstack developer","value_id":"Fullstack developer tunggal"},
     {"label":"ARCHITECTURE","value_en":"Next.js 16 App Router + Supabase (Postgres, Auth, Storage, RLS)","value_id":"Next.js 16 App Router + Supabase (Postgres, Auth, Storage, RLS)"},
     {"label":"SECURITY","value_en":"RLS on every table, get_tracking() for public access, no table grants for anon","value_id":"RLS di setiap tabel, get_tracking() untuk akses publik, tanpa grant tabel untuk anon"},
     {"label":"TESTING","value_en":"50 unit tests (Vitest) + 5 SQL test suites","value_id":"50 unit test (Vitest) + 5 suite tes SQL"},
     {"label":"DEPLOY","value_en":"Vercel, daily cron for WIP cleanup and reminders","value_id":"Vercel, cron harian untuk cleanup WIP dan pengingat"}]'::jsonb,

   -- image_paths (kosong dulu, isi nanti kalau ada screenshot)
   '{}',

   -- highlights_en
   array[
     'Drag-and-drop Kanban board with mouse, touch and keyboard support, backed by a fractional queue_order column so reordering is a single row update that both the artist and the client tracking page read from.',
     'Private client tracking page per commission: current stage, queue position, and an estimated finish date computed from the artist''s real completion pace over 90 days, shown as a ±25% range — no prices, no other clients'' names.',
     'Database-first security: row-level security on every table keyed to auth.uid(), a single security-definer Postgres function (get_tracking) for the public page, and zero table grants for the anonymous role.',
     'Snapshot pricing: base price and add-on prices frozen at booking time as integer rupiah, so price list changes never alter what a client was quoted. All price math in one file with unit tests.',
     'Self-cleaning storage: WIP images compressed to WebP in the browser, capped at 10 per commission, and deleted by a daily Vercel Cron job 30 days after the commission is done.',
     'Daily deadline reminders at 08:00 WIB via Discord webhooks, with per-artist channel selection, reminder window, and once-per-day dedup. Email channel ready to enable.',
     'Full analytics dashboard: income vs unpaid over time, comparison with the previous period, needs-attention list, work pipeline, average turnaround, on-time rate, and income per order type — every chart has a table view and the dashboard filters by type or month.',
     'Bilingual (Indonesian and English) without URL prefixes: a request proxy rewrites paths from a lang cookie so existing tracking links never break. Both languages prerender. Typed dictionaries fail the build on missing keys.'
   ],

   -- highlights_id
   array[
     'Papan Kanban seret-lepas dengan dukungan mouse, sentuh, dan keyboard, didukung kolom queue_order fraksional sehingga pengurutan cukup update satu baris yang dibaca baik artist maupun halaman tracking klien.',
     'Halaman tracking privat per komisi: tahap saat ini, posisi antrean, dan perkiraan selesai yang dihitung dari kecepatan penyelesaian nyata artist selama 90 hari, ditampilkan sebagai rentang ±25% — tanpa harga, tanpa nama klien lain.',
     'Keamanan berbasis database: row-level security di setiap tabel berbasis auth.uid(), satu fungsi Postgres security-definer (get_tracking) untuk halaman publik, dan nol grant tabel untuk role anonymous.',
     'Snapshot harga: harga dasar dan harga add-on dibekukan saat pemesanan sebagai integer rupiah, sehingga perubahan daftar harga tidak mengubah harga yang disepakati klien. Seluruh logika harga di satu file dengan unit test.',
     'Storage yang membersihkan diri: gambar WIP dikompres ke WebP di browser, dibatasi 10 per komisi, dan dihapus Vercel Cron harian 30 hari setelah komisi selesai.',
     'Pengingat deadline harian pukul 08:00 WIB lewat webhook Discord, dengan pilihan saluran per artist, jendela pengingat, dan deduplikasi sekali per hari. Saluran email siap diaktifkan.',
     'Dashboard analitik lengkap: pemasukan vs belum dibayar sepanjang waktu, perbandingan dengan periode sebelumnya, daftar perlu perhatian, pipeline pengerjaan, rata-rata waktu pengerjaan, tingkat tepat waktu, dan pemasukan per tipe pesanan — setiap grafik punya tampilan tabel dan dashboard bisa difilter per tipe atau bulan.',
     'Dwibahasa (Indonesia dan Inggris) tanpa prefiks URL: request proxy menulis ulang path dari cookie lang agar link tracking yang sudah ada tidak rusak. Kedua bahasa di-prerender. Dictionary yang di-type membuat build gagal jika ada key yang hilang.'
   ],

   -- github_url
   'https://github.com/ariefusry/Commission-Tracker',

   -- live_url
   'https://commission-tracker-one.vercel.app',

   -- sort (7, setelah FlexiTask yang sort 6)
   7)

on conflict (id) do update set
  slug = excluded.slug, title = excluded.title,
  summary_en = excluded.summary_en, summary_id = excluded.summary_id,
  badges = excluded.badges, accent_badge = excluded.accent_badge, tech = excluded.tech,
  featured = excluded.featured, has_thumb = excluded.has_thumb,
  overview_en = excluded.overview_en, overview_id = excluded.overview_id,
  facts = excluded.facts, image_paths = excluded.image_paths,
  highlights_en = excluded.highlights_en, highlights_id = excluded.highlights_id,
  github_url = excluded.github_url, live_url = excluded.live_url,
  sort = excluded.sort;

-- Update jumlah project di stats
update public.stats set value = '7' where id = 'projects';
