"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { SmartImage } from "./SmartImage";

/**
 * Video proyek untuk kartu dan Featured Build: tanpa suara, berulang, dan hanya
 * berputar selagi terlihat — beberapa kartu sekaligus tidak ikut men-decode
 * video di HP pengunjung. Dekoratif (`aria-hidden`), jadi tidak menambah
 * perhentian tab di dalam kartu yang seluruhnya satu link.
 *
 * Kalau pengunjung meminta gerak dikurangi, videonya tidak pernah diputar dan
 * yang terlihat hanya poster. Elemen <video> tetap dirender — server tidak
 * tahu preferensi itu, jadi menukarnya dengan <img> memicu hydration mismatch.
 * Kalau videonya gagal dimuat, barulah diganti gambar poster.
 */
export function ProjectVideo({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string | null;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion() ?? false;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (failed || !video) return;
    if (reduced) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // play() ditolak kalau browser memblokir autoplay; posternya tetap tampil.
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [failed, reduced]);

  if (failed) {
    return <SmartImage src={poster} alt="" className={className} />;
  }

  return (
    <video
      ref={ref}
      src={src}
      poster={poster ?? undefined}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
