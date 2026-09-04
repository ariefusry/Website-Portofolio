# Setup

Situs ini jalan tanpa Supabase (konten diambil dari `src/lib/seed.ts`). Supabase
dipakai supaya konten dan aset bisa diubah lewat dashboard `/admin` tanpa deploy ulang.

## Status

Langkah 2–5 **sudah dijalankan** pada project Supabase `Website-Portofolio`
(`fmlehahvxqpaqhntddxt`, region Singapore):

- [x] Project dibuat
- [x] `schema.sql` dan `seed.sql` diterapkan — 11 tabel, RLS aktif, bucket `assets` dan `documents` dibuat
- [x] User admin `ariefusry0@gmail.com` dibuat dan terdaftar di tabel `admins`
- [x] `.env.local` terisi (tidak masuk repo)
- [ ] **Langkah 6** — unggah foto profil, screenshot INDETA, dan `cv.pdf` lewat `/admin/assets`
- [ ] **Langkah 7** — deploy ke Vercel

Panduan lengkap di bawah tetap disimpan untuk keperluan setup ulang atau
membuat environment kedua (mis. project staging).

## 1. Jalankan lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Tanpa `.env.local`, halaman merender konten seed dan
`/admin` dialihkan ke beranda.

## 2. Buat project Supabase

1. Masuk ke https://supabase.com/dashboard → **New project**.
2. Pilih region terdekat (mis. Southeast Asia — Singapore), simpan password database.
3. Tunggu provisioning selesai.

## 3. Jalankan skema dan seed

Di **SQL Editor**, jalankan berurutan:

1. Isi seluruh `supabase/schema.sql` → **Run**.
   Ini membuat semua tabel, fungsi `is_admin()`, policy RLS, dan dua bucket
   Storage publik (`assets`, `documents`).
2. Isi seluruh `supabase/seed.sql` → **Run**.
   Ini mengisi tabel dengan konten yang sama seperti mock desain.

Keduanya aman dijalankan ulang.

## 4. Buat user admin

1. **Authentication → Users → Add user → Create new user**. Isi email dan password,
   centang *Auto Confirm User*.
2. Salin **User UID** yang muncul.
3. Di **SQL Editor**:

   ```sql
   insert into public.admins (user_id) values ('<USER-UID>');
   ```

Hanya user yang ada di tabel `admins` yang bisa menulis — ditegakkan oleh RLS di
database, bukan hanya di UI.

## 5. Hubungkan aplikasi

**Project Settings → API**, salin `Project URL` dan `anon public` key ke `.env.local`:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Restart `npm run dev` (variabel env hanya dibaca saat start).

## 6. Isi aset

Buka http://localhost:3000/admin → login → **Aset & CV**:

- Unggah foto profil (rasio ±4:5) ke bucket `assets`.
- Unggah screenshot INDETA (situs publik + dashboard admin) ke `assets`.
- Unggah `cv.pdf` ke `documents`.

Lalu salin nama berkasnya ke kolom path:

| Berkas | Halaman admin | Kolom |
|---|---|---|
| Foto profil | Profil & hero | `Foto profil` |
| CV PDF | Profil & hero | `CV (PDF)` |
| Screenshot proyek | Selected work → entri proyek | `Screenshot` |
| Screenshot case study | Case study | `Screenshot (3 path)` — baris 1 gambar besar, baris 2–3 thumbnail |

## 7. Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Vercel → **Add New → Project** → pilih repo. Framework terdeteksi otomatis.
3. **Environment Variables** — isi ketiganya (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` dengan domain produksi).
4. Deploy.

Halaman publik memakai ISR 60 detik: perubahan dari dashboard muncul paling lama
satu menit kemudian, tanpa deploy ulang.

## Catatan keamanan

- Hanya `anon` key yang dipakai; **jangan** menaruh `service_role` key di project ini.
- Semua penulisan lewat sesi user + RLS. Kolom yang boleh ditulis dibatasi
  whitelist di `src/lib/admin/schema.ts`.
- `/admin` di-`disallow` di `robots.txt` dan `noindex` lewat metadata.

## Struktur

```
src/app/                 halaman publik, admin, sitemap/robots/OG image
src/components/site/     section situs publik
src/components/admin/    form dan pengelola aset dashboard
src/lib/seed.ts          konten fallback (sumber untuk supabase/seed.sql)
src/lib/content.ts       Supabase → fallback seed
src/lib/supabase/        klien browser/server + pemetaan baris DB
src/lib/admin/           skema form + Server Actions
supabase/                schema.sql, seed.sql
Portfolio.dc.html        mock desain asli (referensi, tidak dipakai runtime)
README.md                dokumen handoff desain
```
