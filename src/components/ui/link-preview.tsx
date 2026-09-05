"use client";

import * as RdxHoverCard from "@radix-ui/react-hover-card";
import { encode } from "qss";
import React, { useCallback, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Pratinjau tautan saat kursor menggantung di atasnya.
 *
 * Diadaptasi dari HoverPeek (21st.dev). Tiga perubahan dari versi aslinya:
 *
 * 1. Aslinya menulis warna dengan varian `dark:` Tailwind. Situs ini tidak
 *    memakai kelas `dark` sama sekali — temanya bertukar lewat token — jadi
 *    kartunya akan tetap putih di tema gelap. Semua warna dipindah ke token.
 * 2. Menghormati reduced-motion: putaran 3D dan pegas mouse-follow dimatikan,
 *    menyisakan pudar biasa.
 * 3. Dua `useEffect` yang hanya menyetel ulang state dibuang. Aturan
 *    react-hooks di project ini menolaknya, dan keduanya memang bisa
 *    diturunkan saat render atau dikerjakan di event handler.
 *
 * Mode `isStatic` yang sudah disediakan komponennya dipakai untuk semua
 * pemanggilan di situs ini — lihat catatan di ProjectDetail soal kenapa
 * layanan screenshot pihak ketiga tidak dipakai.
 */
function usePreviewSource(
  url: string,
  width: number,
  height: number,
  isStatic: boolean,
  staticImageSrc?: string,
) {
  return useMemo(() => {
    if (isStatic) return staticImageSrc || "";
    const params = encode({
      url,
      screenshot: true,
      meta: false,
      embed: "screenshot.url",
      colorScheme: "dark",
      "viewport.isMobile": true,
      "viewport.deviceScaleFactor": 1,
      "viewport.width": width * 2.5,
      "viewport.height": height * 2.5,
    });
    return `https://api.microlink.io/?${params}`;
  }, [isStatic, staticImageSrc, url, width, height]);
}

function useHoverState(followMouse: boolean, onClose: () => void) {
  const [isPeeking, setPeeking] = useState(false);
  const mouseX = useMotionValue(0);
  const followX = useSpring(mouseX, { stiffness: 120, damping: 20 });

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!followMouse) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      mouseX.set((offsetX - rect.width / 2) * 0.3);
    },
    [mouseX, followMouse],
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setPeeking(open);
      if (!open) {
        mouseX.set(0);
        // Beres-beres saat kartu tertutup dikerjakan di sini, di event
        // handler-nya. Versi aslinya memakai useEffect yang memanggil setState
        // — pola yang ditolak aturan react-hooks di project ini, dan memang
        // memicu render tambahan tanpa perlu.
        onClose();
      }
    },
    [mouseX, onClose],
  );

  return { isPeeking, handleOpenChange, handlePointerMove, followX };
}

type HoverPeekProps = {
  children: React.ReactNode;
  /** Tujuan tautan di dalam kartu pratinjau. */
  url: string;
  className?: string;
  peekWidth?: number;
  peekHeight?: number;
  enableMouseFollow?: boolean;
  enableLensEffect?: boolean;
  lensZoomFactor?: number;
  lensSize?: number;
} & ({ isStatic: true; imageSrc: string } | { isStatic?: false; imageSrc?: never });

export const HoverPeek = ({
  children,
  url,
  className,
  peekWidth = 240,
  peekHeight = 135,
  isStatic = false,
  imageSrc = "",
  enableMouseFollow = true,
  enableLensEffect = true,
  lensZoomFactor = 1.75,
  lensSize = 100,
}: HoverPeekProps) => {
  const reduced = useReducedMotion() ?? false;
  const finalImageSrc = usePreviewSource(
    url,
    peekWidth,
    peekHeight,
    isStatic,
    imageSrc,
  );

  const [isHoveringLens, setIsHoveringLens] = useState(false);
  const [lensMousePosition, setLensMousePosition] = useState({ x: 0, y: 0 });
  const lensOn = enableLensEffect && !reduced;

  /*
   * Yang disimpan adalah URL yang gagal dimuat, bukan bendera boolean.
   * Bedanya: kalau sumbernya berganti, status gagalnya batal dengan
   * sendirinya karena diturunkan saat render — tidak perlu effect yang
   * menyetel ulang state.
   */
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageLoadFailed = failedSrc !== null && failedSrc === finalImageSrc;

  const handleClose = useCallback(() => setIsHoveringLens(false), []);
  const { isPeeking, handleOpenChange, handlePointerMove, followX } =
    useHoverState(enableMouseFollow && !reduced, handleClose);

  const handleLensMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!lensOn) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setLensMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // Reduced-motion: pudar saja, tanpa putaran 3D.
  const cardMotionVariants = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.12 } },
        exit: { opacity: 0, transition: { duration: 0.12 } },
      }
    : {
        initial: { opacity: 0, rotateY: -90, transition: { duration: 0.15 } },
        animate: {
          opacity: 1,
          rotateY: 0,
          transition: { type: "spring" as const, stiffness: 200, damping: 18 },
        },
        exit: { opacity: 0, rotateY: 90, transition: { duration: 0.15 } },
      };

  const lensMotionVariants = {
    initial: { opacity: 0, scale: 0.7 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.7, transition: { duration: 0.2 } },
  };

  const triggerChild = React.isValidElement(children) ? (
    React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      className: cn(
        (children.props as { className?: string }).className,
        className,
      ),
      onPointerMove: handlePointerMove,
    })
  ) : (
    <span className={className} onPointerMove={handlePointerMove}>
      {children}
    </span>
  );

  return (
    <RdxHoverCard.Root
      openDelay={75}
      closeDelay={150}
      onOpenChange={handleOpenChange}
    >
      <RdxHoverCard.Trigger asChild>{triggerChild}</RdxHoverCard.Trigger>

      <RdxHoverCard.Portal>
        <RdxHoverCard.Content
          className="z-50 [--radix-hover-card-content-transform-origin:center_center] [perspective:800px]"
          side="top"
          align="center"
          sideOffset={12}
          // Pointer events dimatikan di pembungkus saat lensa aktif, supaya
          // hover hanya terdeteksi di gambar di dalamnya.
          style={{ pointerEvents: lensOn ? "none" : "auto" }}
        >
          <AnimatePresence>
            {isPeeking && (
              <motion.div
                variants={cardMotionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  x: enableMouseFollow && !reduced ? followX : 0,
                  pointerEvents: "auto",
                }}
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "relative block overflow-hidden rounded-lg bg-surface p-0.5",
                    "border border-[var(--color-line-strong)]",
                    "shadow-[0_12px_32px_rgba(0,0,0,0.18)]",
                  )}
                  onMouseEnter={() => lensOn && setIsHoveringLens(true)}
                  onMouseLeave={() => lensOn && setIsHoveringLens(false)}
                  onMouseMove={handleLensMouseMove}
                >
                  {imageLoadFailed ? (
                    <div
                      className="flex items-center justify-center bg-page font-body text-xs text-muted"
                      style={{ width: peekWidth, height: peekHeight }}
                    >
                      Pratinjau tidak tersedia
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={finalImageSrc}
                      width={peekWidth}
                      height={peekHeight}
                      className="pointer-events-none block rounded-[5px] bg-page align-top"
                      alt={`Pratinjau ${url}`}
                      onError={() => setFailedSrc(finalImageSrc)}
                      loading="lazy"
                    />
                  )}

                  <AnimatePresence>
                    {lensOn && isHoveringLens && !imageLoadFailed && (
                      <motion.div
                        className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg"
                        variants={lensMotionVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{
                          maskImage: `radial-gradient(circle ${lensSize / 2}px at ${lensMousePosition.x}px ${lensMousePosition.y}px, black ${lensSize / 2}px, transparent ${lensSize / 2}px)`,
                          WebkitMaskImage: `radial-gradient(circle ${lensSize / 2}px at ${lensMousePosition.x}px ${lensMousePosition.y}px, black ${lensSize / 2}px, transparent ${lensSize / 2}px)`,
                        }}
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            transform: `scale(${lensZoomFactor})`,
                            transformOrigin: `${lensMousePosition.x}px ${lensMousePosition.y}px`,
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={finalImageSrc}
                            width={peekWidth}
                            height={peekHeight}
                            className="block rounded-[5px] bg-page align-top"
                            alt=""
                            aria-hidden="true"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </RdxHoverCard.Content>
      </RdxHoverCard.Portal>
    </RdxHoverCard.Root>
  );
};
