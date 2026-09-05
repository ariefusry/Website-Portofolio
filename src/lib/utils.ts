import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Gabungkan class Tailwind dengan penyelesaian konflik: class yang datang
 * belakangan menang, jadi `className` pemanggil bisa menimpa default komponen
 * (mis. mengganti `text-white` bawaan jadi `text-ink` untuk tombol terang).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Rapikan URL yang diketik di dashboard jadi tautan keluar yang benar.
 *
 * Alamat tanpa skema seperti `sugih.vercel.app` dibaca browser sebagai path
 * relatif, jadi tautannya berakhir di `/projects/sugih.vercel.app` — bukan ke
 * situsnya. Ini gampang terjadi karena orang memang menulis alamat tanpa
 * `https://`, dan sebagian kolom di admin bahkan memintanya begitu.
 *
 * `mailto:` dan `tel:` dibiarkan apa adanya.
 */
export function externalHref(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  return /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
