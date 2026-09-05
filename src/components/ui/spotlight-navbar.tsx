"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Pil nav melayang dengan dua lapis cahaya:
 *
 * 1. Sorotan yang mengikuti kursor di sepanjang pil.
 * 2. Garis tipis di bawah item yang sedang aktif, yang meluncur saat
 *    section berganti.
 *
 * Diadaptasi dari spotlight-navbar VengeanceUI, dengan tiga perubahan:
 *
 * - Aslinya memanggil `preventDefault()` pada tiap link dan menyimpan indeks
 *   aktifnya sendiri. Di sini navigasinya harus tetap nyata (anchor, pindah
 *   halaman, buka di tab baru) dan item aktif sudah ditentukan oleh
 *   IntersectionObserver di Header — jadi komponen ini hanya menerima link
 *   sebagai children dan mencari yang bertanda `data-active`.
 * - Aslinya membaca kelas `.dark` di <html> lewat MutationObserver. Situs ini
 *   memakai token warna, jadi warnanya cukup ikut `--color-ink` dan berganti
 *   sendiri. (Di komponen asli hasil deteksi itu bahkan tidak pernah dipakai.)
 * - Aslinya memakai empat kelas CSS yang tidak ikut dikirim dalam paketnya
 *   (`spotlight-nav-bg`, `glass-border`, ...), jadi tampilannya dibangun ulang
 *   dengan token di sini.
 */
export function SpotlightPill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const navRef = useRef<HTMLDivElement>(null);
  const spotlightX = useRef(0);
  const ambienceX = useRef(0);
  const [hovering, setHovering] = useState(false);
  const reduced = useReducedMotion() ?? false;

  /** Geser garis aktif ke tengah item bertanda `data-active`. */
  const moveAmbience = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const active = nav.querySelector<HTMLElement>("[data-active='true']");

    const set = (v: number) => {
      ambienceX.current = v;
      nav.style.setProperty("--ambience-x", `${v}px`);
    };

    // Tidak ada item aktif (mis. sedang di halaman /projects): sembunyikan.
    if (!active) {
      nav.style.setProperty("--ambience-opacity", "0");
      return;
    }
    nav.style.setProperty("--ambience-opacity", "1");

    const navRect = nav.getBoundingClientRect();
    const itemRect = active.getBoundingClientRect();
    const target = itemRect.left - navRect.left + itemRect.width / 2;

    if (reduced) {
      set(target);
      return;
    }
    const controls = animate(ambienceX.current, target, {
      type: "spring",
      stiffness: 200,
      damping: 20,
      onUpdate: set,
    });
    return () => controls.stop();
  }, [reduced]);

  // Item aktif berubah lewat prop/DOM, bukan state di komponen ini, jadi
  // perubahannya diamati langsung pada atribut anak-anaknya.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    moveAmbience();

    const observer = new MutationObserver(() => moveAmbience());
    observer.observe(nav, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-active"],
    });
    // Lebar pil berubah saat bahasa diganti atau jendela di-resize.
    const resize = new ResizeObserver(() => moveAmbience());
    resize.observe(nav);

    return () => {
      observer.disconnect();
      resize.disconnect();
    };
  }, [moveAmbience]);

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const nav = navRef.current;
    if (!nav) return;
    const x = e.clientX - nav.getBoundingClientRect().left;
    spotlightX.current = x;
    nav.style.setProperty("--spotlight-x", `${x}px`);
  };

  return (
    <div
      ref={navRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        "relative isolate overflow-hidden rounded-full border border-[var(--color-line)] bg-surface/70 shadow-[0_8px_24px_rgba(0,0,0,0.10)] backdrop-blur-md",
        className,
      )}
    >
      {/* Sorotan yang mengikuti kursor. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300 motion-reduce:transition-none"
        style={{
          opacity: hovering ? 1 : 0,
          background:
            "radial-gradient(120px circle at var(--spotlight-x, 50%) 100%, color-mix(in oklab, var(--color-ink) 12%, transparent) 0%, transparent 50%)",
        }}
      />

      {/* Garis tipis di bawah item aktif. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px"
        style={{
          opacity: "var(--ambience-opacity, 0)",
          background:
            "radial-gradient(60px circle at var(--ambience-x, 50%) 0%, var(--color-ink) 0%, transparent 100%)",
        }}
      />

      {children}
    </div>
  );
}

/** Satu item di dalam pil. `active` menyalakan garis di bawahnya. */
export function SpotlightNavItem({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center" data-active={active ? "true" : "false"}>
      {children}
    </li>
  );
}
