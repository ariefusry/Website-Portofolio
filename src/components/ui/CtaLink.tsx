import React from "react";
import { cn } from "@/lib/utils";
import { ShimmerLink, type ShimmerLinkProps } from "./shimmer-button";

/**
 * CTA utama situs. Satu tempat untuk gaya tombol berkilau supaya keempat
 * pemakaiannya benar-benar identik, bukan empat salinan class string yang
 * lama-lama melenceng sendiri.
 *
 * `dark` untuk aksi navigasi; `accent` khusus unduh CV — warnanya
 * `--color-accent-strong` yang sudah diukur 5.9:1 dengan teks putih.
 */
export type CtaVariant = "dark" | "accent";

const BASE =
  "px-[22px] py-[13px] font-display text-sm leading-none font-semibold hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/*
 * Warna kilau mengikuti warna teks tombolnya, bukan putih mati: di tema gelap
 * tombol `ink` justru berlatar terang, dan kilau putih di atasnya tidak terlihat
 * sama sekali.
 */
const VARIANT: Record<
  CtaVariant,
  { className: string; background: string; shimmer: string; duration: string }
> = {
  dark: {
    background: "var(--color-ink)",
    shimmer: "var(--color-on-ink)",
    duration: "3s",
    className:
      "text-on-ink border-[color-mix(in_oklab,var(--color-on-ink)_18%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid",
  },
  accent: {
    background: "var(--color-accent-strong)",
    shimmer: "var(--color-on-accent-strong)",
    duration: "3.4s",
    // Ring fokus ink: di atas isian hangat, ring aksen nyaris tak terlihat.
    className:
      "text-on-accent-strong border-[color-mix(in_oklab,var(--color-on-accent-strong)_22%,transparent)] shadow-[0_6px_18px_color-mix(in_oklch,var(--color-accent-strong)_32%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
  },
};

/**
 * forwardRef, bukan komponen fungsi biasa: pembungkus seperti Radix
 * `Trigger asChild` menitipkan ref ke anaknya, dan tanpa diteruskan ke <a> yang
 * sebenarnya, pemicu hover-nya tidak pernah menempel ke apa pun.
 */
export const CtaLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<ShimmerLinkProps, "background" | "borderRadius" | "shimmerDuration"> & {
    variant?: CtaVariant;
  }
>(function CtaLink({ variant = "dark", className, children, ...props }, ref) {
  const v = VARIANT[variant];

  return (
    <ShimmerLink
      ref={ref}
      background={v.background}
      shimmerColor={v.shimmer}
      borderRadius="8px"
      shimmerDuration={v.duration}
      className={cn(BASE, v.className, className)}
      {...props}
    >
      {children}
    </ShimmerLink>
  );
});

/** Panah `→` yang bergeser saat hover, dan diam saat reduced-motion. */
export function CtaArrow() {
  return (
    <span
      aria-hidden="true"
      className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
    >
      →
    </span>
  );
}
