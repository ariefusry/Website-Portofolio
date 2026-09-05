"use client";

import { useRef, useState } from "react";

/**
 * Sorotan lembut yang mengikuti kursor di dalam sebuah wadah.
 *
 * Posisinya ditulis sebagai custom property langsung ke elemen lewat ref,
 * bukan disimpan di state React: kursor bergerak puluhan kali per detik, dan
 * me-render ulang komponen setiap kali hanya untuk menggeser satu gradien
 * adalah pemborosan yang terasa. Yang masuk state cuma "sedang disentuh atau
 * tidak", yang berubah dua kali saja.
 */
export function useCursorGlow<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [hovering, setHovering] = useState(false);

  const handlers = {
    onMouseMove: (e: React.MouseEvent<T>) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--glow-x", `${e.clientX - r.left}px`);
      el.style.setProperty("--glow-y", `${e.clientY - r.top}px`);
    },
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
  };

  return { ref, hovering, handlers };
}

/**
 * Lapisan gradiennya. Wadahnya harus `relative isolate overflow-hidden` supaya
 * sorotannya terpotong mengikuti sudut membulat wadah.
 *
 * `-z-10`, jadi sorotannya berada di bawah isi wadah tapi tetap di atas latar
 * wadah — anak ber-z negatif memang digambar begitu. Efeknya sorotan menyapu
 * bagian teks tapi berhenti di blok gambar, karena blok itu punya latar buram
 * sendiri dan menutupinya. Itu memang yang diinginkan: gradien tidak boleh
 * mengenai screenshot-nya.
 *
 * `pointer-events-none` menjaga klik tetap tembus ke link.
 */
export function CursorGlow({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0 }}
      className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300 motion-reduce:transition-none [background:radial-gradient(260px_circle_at_var(--glow-x,50%)_var(--glow-y,50%),color-mix(in_oklab,var(--color-ink)_15%,transparent)_0%,transparent_72%)]"
    />
  );
}
