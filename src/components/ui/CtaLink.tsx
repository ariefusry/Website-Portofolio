import React from "react";
import { cn } from "@/lib/utils";

/**
 * CTA utama situs. Satu tempat untuk gaya tombol supaya semua pemakaiannya
 * identik, bukan salinan class string yang lama-lama melenceng sendiri.
 *
 * `dark` untuk aksi navigasi; `accent` khusus unduh CV — warnanya
 * `--color-accent-strong` yang sudah diukur 5.9:1 dengan teks putih.
 */
export type CtaVariant = "dark" | "accent";

const BASE =
  "inline-flex items-center justify-center rounded-lg px-[22px] py-[13px] font-display text-sm leading-none font-semibold transition-[opacity,transform] duration-200 hover:opacity-85 active:translate-y-px motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2";

const VARIANT: Record<CtaVariant, string> = {
  dark: "bg-ink text-on-ink focus-visible:outline-accent-solid",
  // Ring fokus ink: ring aksen di atas isian biru nyaris tak terlihat.
  accent: "bg-accent-strong text-on-accent-strong focus-visible:outline-ink",
};

/**
 * forwardRef, bukan komponen fungsi biasa: pembungkus seperti Radix
 * `Trigger asChild` menitipkan ref ke anaknya, dan tanpa diteruskan ke <a> yang
 * sebenarnya, pemicu hover-nya tidak pernah menempel ke apa pun.
 */
export const CtaLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: CtaVariant }
>(function CtaLink({ variant = "dark", className, children, ...props }, ref) {
  return (
    <a ref={ref} className={cn(BASE, VARIANT[variant], className)} {...props}>
      {children}
    </a>
  );
});
