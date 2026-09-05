"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Muncul perlahan saat pertama masuk layar.
 *
 * Dipasang di tingkat SECTION, bukan tiap kartu atau paragraf. Kalau setiap
 * elemen kecil bergerak sendiri-sendiri, halaman terasa gelisah dan lambat —
 * yang ingin dicapai di sini cuma satu hal: bagian yang baru muncul terasa
 * datang, bukan tiba-tiba ada.
 *
 * `once: true` — sekali saja. Menggulir balik ke atas tidak memutar ulang
 * apa pun; animasi yang berulang tiap lewat justru mengganggu saat orang
 * membaca bolak-balik.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion() ?? false;

  // Tanpa gerakan: render apa adanya, bukan animasi yang dimatikan —
  // supaya tidak ada elemen yang berisiko tersangkut transparan.
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      // amount 0.15: cukup sedikit terlihat untuk memicu, jadi section tinggi
      // tidak menunggu sampai separuhnya masuk layar.
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
