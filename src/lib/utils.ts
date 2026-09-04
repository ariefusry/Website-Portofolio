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
