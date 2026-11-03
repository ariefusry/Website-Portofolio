"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { SmartImage } from "@/components/ui/SmartImage";
import { CtaLink } from "@/components/ui/CtaLink";
import type { Profile } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ profile }: { profile: Profile }) {
  const { t } = useLang();
  const reduced = useReducedMotion() ?? false;

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
      // `justify-start`, bukan `justify-center`: hero setinggi layar sementara
      // isinya jauh lebih pendek, jadi memusatkannya membagi sisa ruang rata ke
      // atas dan bawah — teks terdorong jauh dari navbar dan atasnya terasa
      // kosong. Ditempel ke atas, sisa ruangnya jatuh ke bawah, tempat foto
      // berdiri.
      className="section-x relative flex min-h-[calc(100svh-var(--header-h))] flex-col overflow-hidden pt-8 md:pt-[7vh]"
    >
      {/*
        Pembungkus terpusat dengan lebar maksimum. Tanpa ini, di layar lebar
        teks menempel ke tepi kiri dan foto ke tepi kanan — di 1900px menyisakan
        586px kosong menganga di tengah, dan itulah yang membuat hero terasa
        tidak simetris.

        `relative` + `flex-1`: foto diposisikan absolut terhadap pembungkus ini,
        dan karena ia meregang setinggi section, dasarnya tepat di garis pemisah
        dengan About. Section sengaja tanpa padding bawah supaya batas itu benar.
      */}
      <div className="section-inner relative flex flex-1 flex-col">
        {/*
          Track kedua dipatok lebar tetap, bukan pecahan: judulnya sendiri sudah
          dibatasi 640px, jadi memberi kolom teks porsi lebih besar hanya
          menyisakan ruang kosong. Lebar itu yang dipesan untuk foto.
        */}
        <div className="grid items-start gap-10 md:grid-cols-[1fr_minmax(0,480px)] md:gap-12">
        <div className="relative">
          {/*
            Nama lengkap di atas judul: header tidak lagi memuat nama, dan HR
            yang datang dari CV perlu mencocokkan nama dengan pemilik situs
            sebelum membaca apa pun. Ditulis langsung, bukan dari profile.name,
            karena kolom itu berisi singkatan.
          */}
          <p className="mt-0 mb-3 font-display text-[18px] leading-tight font-semibold tracking-[-0.01em] text-ink md:text-[20px]">
            Arief Muhammad Usry
          </p>

          {/* H1 langsung terbaca: ini yang pertama dicari pembaca, jadi tidak ditahan animasi. */}
          <h1 className="mt-0 mb-6 max-w-[640px] font-display font-semibold tracking-[-0.035em] text-pretty text-[clamp(34px,7vw,60px)] leading-[1.04]">
            {t(profile.heroTitle)}
          </h1>

          {/* 5. Subhead */}
          <motion.p
            className="mt-0 mb-[34px] max-w-[520px] font-body text-[17px] leading-[1.65] font-normal text-body-2 text-pretty"
            {...fade(0.1)}
          >
            {t(profile.heroSub)}
          </motion.p>

          {/* 6. Tombol CTA */}
          <motion.div className="flex flex-wrap gap-3" {...fade(0.2)}>
            {/* Primer: gelap, kilau putih */}
            <CtaLink href="#projects">{t(UI.ctaWork)}</CtaLink>

            {/* Sekunder: aksen pekat + teks putih (5.9:1). Tanpa berkas CV, tombolnya tidak dirender sama sekali. */}
            {profile.cvUrl ? (
              <CtaLink
                variant="accent"
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(UI.ctaCv)}
              </CtaLink>
            ) : null}
          </motion.div>
        </div>

        {/*
          7. Foto profil.

          Foto cutout ditambatkan ke dasar section, bukan ikut dipusatkan
          bersama teks: subjek yang dipotong sebatas pinggang akan terlihat
          melayang kalau menggantung di tengah ruang kosong. Di dasar section
          itulah letak garis pemisah dengan About, jadi subjeknya berdiri di
          garis itu.

          Di layar lebar ia diposisikan absolut terhadap pembungkus terpusat,
          bukan terhadap section — kalau ditambatkan ke section ia menempel ke
          tepi layar dan komposisinya terbelah lagi. Track grid keduanya tetap
          memesan lebarnya meski isinya keluar dari alur, sehingga teksnya tidak
          merangkak ke bawah foto.

          Selama fotonya belum ada, bingkai bergarisnya dipertahankan supaya
          slotnya terbaca sebagai "unggah di sini", bukan sebagai lubang.
        */}
        <motion.div
          className={
            profile.photoUrl
              ? "relative md:absolute md:right-0 md:bottom-0 md:w-[42%] md:max-w-[520px]"
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
            alt={`${t(UI.photoAlt)}: ${profile.name}`}
            label={t(UI.photoPlaceholder)}
            priority
            fit="contain"
            align="bottom"
            sizes="(max-width: 768px) 100vw, 520px"
            className={
              profile.photoUrl
                ? "h-[440px] w-full md:h-[min(84vh,760px)]"
                : "h-[360px] w-full"
            }
          />
        </motion.div>
        </div>
      </div>
    </section>
  );
}
