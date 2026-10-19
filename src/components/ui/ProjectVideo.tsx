"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { SmartImage } from "./SmartImage";

/**
 * Video proyek untuk kartu dan Featured Build: tanpa suara, berulang, dan hanya
 * berputar selagi terlihat — beberapa kartu sekaligus tidak ikut men-decode
 * video di HP pengunjung. Dekoratif (`aria-hidden`), jadi tidak menambah
 * perhentian tab di dalam kartu yang seluruhnya satu link.
 *
 * Gambarnya tetap SmartImage biasa (lazy, dioptimasi next/image), dan videonya
 * ditumpuk di atas tanpa poster dengan `preload="none"`: tidak ada byte video
 * yang diunduh sebelum kartunya terlihat. Video yang belum punya frame itu
 * transparan, jadi gambar di bawahnya yang tampil — selama memuat, kalau
 * berkasnya gagal dimuat, dan untuk pengunjung yang meminta gerak dikurangi
 * (videonya tidak pernah diputar).
 */
export function ProjectVideo({
  src,
  poster,
  sizes,
  className = "",
}: {
  src: string;
  poster: string | null;
  sizes?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduced) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // play() ditolak kalau browser memblokir autoplay; gambarnya tetap tampil.
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <SmartImage src={poster} alt="" sizes={sizes} className="h-full w-full" />
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
