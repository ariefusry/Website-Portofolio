"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { SmartImage } from "@/components/ui/SmartImage";

type Item = { kind: "video" | "image"; src: string };

const FRAME =
  "overflow-hidden rounded-[14px] border border-[var(--color-line)] bg-page";
const NAV =
  "absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-[var(--color-line-strong)] bg-surface/90 font-display text-lg text-ink transition-opacity disabled:cursor-default disabled:opacity-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid";

/**
 * Media di atas halaman detail: video lebih dulu (kalau ada), lalu screenshot
 * sesuai urutan galeri di admin. Lintasannya CSS scroll-snap biasa — geser di
 * layar sentuh dan tombol panah saat difokus sudah bawaan browser; tombol ‹ ›
 * dan deretan thumbnail hanya menggulirnya ke slide tertentu.
 *
 * Satu item saja (atau kosong) dirender persis seperti gambar utama dulu:
 * tanpa tombol, tanpa thumbnail.
 */
export function MediaViewer({
  title,
  videoUrl,
  images,
}: {
  title: string;
  videoUrl: string | null;
  images: string[];
}) {
  const { t } = useLang();
  const reduced = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);

  const items: Item[] = [
    ...(videoUrl ? [{ kind: "video" as const, src: videoUrl }] : []),
    ...images.map((src) => ({ kind: "image" as const, src })),
  ];

  // Video hanya berputar selagi jadi slide aktif; berpindah slide = berhenti.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active === 0 && !reduced) video.play().catch(() => {});
    else video.pause();
  }, [active, reduced]);

  function go(index: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({
      left: index * track.clientWidth,
      behavior: reduced ? "auto" : "smooth",
    });
  }

  function slide(item: Item, i: number) {
    if (item.kind === "video") {
      return (
        <video
          ref={videoRef}
          src={item.src}
          poster={images[0]}
          controls
          muted
          playsInline
          preload="metadata"
          className="aspect-[16/9] w-full bg-page object-contain"
        />
      );
    }
    const n = videoUrl ? i : i + 1;
    return (
      <SmartImage
        src={item.src}
        alt={`${title} — ${t(UI.screenshotOf)}${items.length > 1 ? ` ${n}` : ""}`}
        priority={i === 0}
        sizes="(max-width: 1024px) 100vw, 1000px"
        fit="contain"
        className="aspect-[16/9] w-full bg-page"
      />
    );
  }

  if (items.length <= 1) {
    return (
      <div className={`mb-12 ${FRAME}`}>
        {items[0] ? (
          slide(items[0], 0)
        ) : (
          <SmartImage
            src={null}
            alt=""
            label={`[ screenshot ${title} ]`}
            className="aspect-[16/9] w-full"
          />
        )}
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className={`relative ${FRAME}`}>
        <div
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-label={title}
          onScroll={(e) => {
            const track = e.currentTarget;
            setActive(Math.round(track.scrollLeft / track.clientWidth));
          }}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-solid [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, i) => (
            <div key={item.src} className="w-full shrink-0 snap-center">
              {slide(item, i)}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(active - 1)}
          disabled={active === 0}
          aria-label={t(UI.prevMedia)}
          className={`left-3 ${NAV}`}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(active + 1)}
          disabled={active === items.length - 1}
          aria-label={t(UI.nextMedia)}
          className={`right-3 ${NAV}`}
        >
          ›
        </button>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`${t(UI.showMedia)} ${i + 1}${item.kind === "video" ? ` (${t(UI.projectVideo)})` : ""}`}
            aria-current={i === active}
            className={`relative w-24 shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid ${
              i === active ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <SmartImage
              src={item.kind === "video" ? (images[0] ?? null) : item.src}
              alt=""
              sizes="96px"
              className="aspect-[16/9] w-full bg-page"
            />
            {item.kind === "video" ? (
              <span
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center bg-black/35 text-sm text-white"
              >
                ▶
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
