"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { SmartImage } from "@/components/ui/SmartImage";
import { CtaLink } from "@/components/ui/CtaLink";
import type { Profile } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Bungkus tiap kata dalam mask overflow-hidden untuk reveal per kata. */
function WordReveal({
  text,
  animateIn,
}: {
  text: string;
  animateIn: boolean;
}) {
  const words = text.split(/\s+/).filter(Boolean);

  // Setelah animasi masuk selesai, ganti bahasa hanya menukar teks — tidak memutar ulang.
  if (!animateIn) return <>{text}</>;

  return (
    <>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          {i > 0 ? " " : null}
          <span className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
            <motion.span
              className="inline-block whitespace-pre will-change-transform"
              initial={{ opacity: 0, y: "105%" }}
              animate={{ opacity: 1, y: "0%" }}
              transition={{ duration: 0.85, delay: 0.18 + i * 0.045, ease: EASE }}
            >
              {word}
            </motion.span>
          </span>
        </span>
      ))}
    </>
  );
}

export function Hero({ profile }: { profile: Profile }) {
  const { lang, t } = useLang();
  const reduced = useReducedMotion() ?? false;

  // Animasi masuk berjalan sekali per load; setelah selesai, toggle bahasa
  // hanya menukar teks tanpa memutar ulang reveal.
  const [introDone, setIntroDone] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setIntroDone(true), 1400);
    return () => window.clearTimeout(id);
  }, []);

  // Kunci mount: animasi hero dijalankan sekali saat load, bukan tiap ganti bahasa.
  const fade = (delay: number, y = 16, extra: Record<string, number> = {}) =>
    reduced
      ? { initial: false as const, animate: { opacity: 1, y: 0, ...extra } }
      : {
          initial: { opacity: 0, y, ...extra },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <section
      id="top"
      // Setinggi layar dikurangi header, jadi saat pertama dibuka hero mengisi
      // penuh dan section berikutnya belum mengintip. `svh` bukan `vh`: di
      // browser mobile `vh` menghitung bar alamat yang tersembunyi, dan hero
      // jadi lebih tinggi dari layar sebenarnya.
      className="section-x relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center overflow-hidden pt-14 pb-16 md:pt-[84px] md:pb-[68px]"
    >
      <div className="grid items-center gap-10 md:grid-cols-[1.35fr_.8fr] md:gap-14">
        <div className="relative">
          {/* 2. Status badge */}
          <motion.div
            className="mb-[30px] inline-flex items-center gap-2 rounded-full bg-accent-bg px-[13px] py-[7px] font-mono text-[11.5px] leading-[1.1] font-semibold whitespace-nowrap text-accent-ink"
            {...(reduced
              ? { initial: false as const, animate: { opacity: 1, y: 0 } }
              : {
                  initial: { opacity: 0, y: 14 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.6, delay: 0.05, ease: EASE },
                })}
          >
            {/* 3. Dot berdenyut */}
            <motion.span
              className="h-1.5 w-1.5 flex-none rounded-full bg-accent-solid"
              animate={
                reduced ? undefined : { scale: [1, 1.65, 1], opacity: [1, 0.45, 1] }
              }
              transition={
                reduced
                  ? undefined
                  : {
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.8,
                    }
              }
            />
            {t(profile.badge)}
          </motion.div>

          {/* 4. H1 reveal per kata */}
          <h1 className="mt-0 mb-6 max-w-[640px] font-display font-semibold tracking-[-0.035em] text-pretty text-[clamp(34px,7vw,60px)] leading-[1.04]">
            <WordReveal
              // Re-split saat bahasa berganti; animasinya sendiri hanya jalan sekali.
              key={lang}
              text={t(profile.heroTitle)}
              animateIn={!reduced && !introDone}
            />
          </h1>

          {/* 5. Subhead */}
          <motion.p
            className="mt-0 mb-[34px] max-w-[520px] font-body text-[17px] leading-[1.65] font-normal text-body-2 text-pretty"
            {...fade(0.55)}
          >
            {t(profile.heroSub)}
          </motion.p>

          {/* 6. Tombol CTA */}
          <motion.div className="flex flex-wrap gap-3" {...fade(0.68)}>
            {/* Primer: gelap, kilau putih */}
            <CtaLink href="#projects">{t(UI.ctaWork)}</CtaLink>

            {/* Sekunder: aksen pekat + teks putih (5.9:1), kilau putih */}
            <CtaLink
              variant="accent"
              href={profile.cvUrl ?? "#"}
              {...(profile.cvUrl
                ? { target: "_blank", rel: "noopener noreferrer" }
                : { "aria-disabled": true })}
              className={profile.cvUrl ? "" : "opacity-70"}
            >
              {t(UI.ctaCv)}
            </CtaLink>
          </motion.div>
        </div>

        {/*
          7. Foto profil. Begitu fotonya ada, bingkainya dilepas dan gambar
          dirender `contain` — untuk PNG berlatar transparan, kotak bergaris
          justru mengembalikan persis batas yang ingin dihilangkan. Selama
          masih kosong, bingkai bergarisnya dipertahankan supaya slotnya
          terbaca sebagai "unggah di sini", bukan sebagai lubang.
        */}
        <motion.div
          className={
            profile.photoUrl
              ? ""
              : "overflow-hidden rounded-xl border border-[var(--color-line-strong)]"
          }
          {...(reduced
            ? { initial: false as const, animate: { opacity: 1, y: 0, scale: 1 } }
            : {
                initial: { opacity: 0, y: 28, scale: 0.97 },
                animate: { opacity: 1, y: 0, scale: 1 },
                transition: { duration: 1, delay: 0.3, ease: EASE },
              })}
        >
          <SmartImage
            src={profile.photoUrl}
            alt={`${t(UI.photoAlt)} — ${profile.name}`}
            label={t(UI.photoPlaceholder)}
            priority
            fit="contain"
            sizes="(max-width: 768px) 100vw, 360px"
            className="h-[360px] w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
