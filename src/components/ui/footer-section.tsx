"use client";

import type { ComponentProps, ReactNode } from "react";
// Paket `motion` adalah penerus framer-motion dengan API yang sama; project ini
// sudah memakai framer-motion, jadi impor dari sana agar tidak ada dua salinan
// library animasi yang sama di bundle.
import { motion, useReducedMotion } from "framer-motion";

export type FooterLink = {
  title: string;
  href: string;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
};

export type FooterColumn = {
  label: string;
  links: FooterLink[];
};

/**
 * Footer gelap dengan kolom tautan yang muncul (blur + naik) saat masuk layar.
 *
 * Sengaja tanpa daftar tautan bawaan: isinya diserahkan lewat props supaya
 * tidak ada link ke halaman yang tidak dimiliki situs ini.
 */
export function Footer({
  heading,
  note,
  columns,
  copyright,
  brand,
}: {
  heading: ReactNode;
  note?: ReactNode;
  columns: FooterColumn[];
  copyright: string;
  brand?: ReactNode;
}) {
  return (
    <footer className="relative w-full bg-dark-bg text-dark-text">
      {/* Garis cahaya tipis di tepi atas */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 h-px w-1/3 -translate-x-1/2 rounded-full bg-accent-dark/60 blur-[2px]"
      />

      <div className="section-x mx-auto grid w-full max-w-[1200px] gap-12 py-16 xl:grid-cols-3 xl:gap-10">
        <AnimatedContainer className="space-y-4">
          {brand}
          <h2 className="mt-0 mb-3.5 max-w-[560px] font-display text-[clamp(28px,5vw,40px)] leading-[1.1] font-semibold tracking-[-0.03em]">
            {heading}
          </h2>
          {note ? (
            <p className="m-0 font-body text-[15.5px] leading-[1.6] font-normal text-dark-2">
              {note}
            </p>
          ) : null}
          <p className="m-0 pt-4 font-mono text-xs leading-none text-dark-2/70">
            {copyright}
          </p>
        </AnimatedContainer>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:col-span-2">
          {columns.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <h3 className="m-0 font-mono text-xs leading-none font-semibold text-dark-2">
                {section.label}
              </h3>
              <ul className="mt-4 mb-0 grid list-none gap-2.5 p-0 font-body text-sm">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="inline-flex items-center gap-2 rounded text-dark-2 transition-colors duration-300 hover:text-dark-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark motion-reduce:transition-none"
                    >
                      {link.icon ? (
                        <link.icon className="size-4 shrink-0" />
                      ) : null}
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
