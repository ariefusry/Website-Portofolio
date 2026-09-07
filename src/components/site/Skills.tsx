"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { TwoColSection } from "@/components/ui/Primitives";
import { TechGlyph, techIcon } from "@/components/ui/TechIcons";
import type { SkillGroup } from "@/lib/types";

/**
 * Kecepatan per baris; sedikit berbeda supaya ketiganya tidak bergerak seragam.
 * Baris tengah sengaja berlawanan arah — pergerakan yang saling melawan lebih
 * enak dilihat daripada tiga baris yang meluncur searah.
 */
const ROWS = [
  { speed: "52s", reverse: false },
  { speed: "44s", reverse: true },
  { speed: "36s", reverse: false },
];

/** Sama dengan --ease-brand; dipakai supaya geraknya sekeluarga dengan Reveal. */
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Membungkus isi yang tingginya berubah, lalu menganimasikan tinggi itu.
 *
 * Pita satu baris vs daftar penuh enam baris bedanya ratusan piksel, dan tanpa
 * ini tombol di bawahnya melompat begitu ditekan. Tingginya diukur ulang lewat
 * ResizeObserver, jadi ikut benar saat lebar layar berubah dan pil-nya membungkus
 * ke jumlah baris yang lain.
 *
 * Sengaja BUKAN `layout` milik framer-motion: itu menganimasikan tinggi lewat
 * scaleY, dan teks di dalam pil ikut gepeng selama transisinya berjalan.
 */
function AutoHeight({
  children,
  animate,
}: {
  children: React.ReactNode;
  animate: boolean;
}) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    // getBoundingClientRect, bukan offsetHeight: yang kedua dibulatkan ke
    // integer, dan sisa pecahannya memotong tipis baris terakhir.
    const observer = new ResizeObserver(() =>
      setHeight(el.getBoundingClientRect().height),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className="overflow-hidden"
      // Render pertama belum sempat mengukur — biarkan setinggi isinya.
      animate={{ height: height ?? "auto" }}
      // Tanpa ini framer menganimasikan tinggi dari nol saat mount.
      initial={false}
      transition={animate ? { duration: 0.42, ease: EASE } : { duration: 0 }}
    >
      <div ref={inner}>{children}</div>
    </motion.div>
  );
}

/**
 * Satu skill: logo brand bila ada, plus namanya — di sini nama itu isi utamanya.
 *
 * Semua grup memakai latar abu yang sama. Sebelumnya grup non-aksen memakai
 * `bg-page`, yang di tema gelap berarti hitam pekat — lambang brand yang juga
 * hitam jadi tenggelam di dalamnya.
 */
function SkillPill({ label }: { label: string }) {
  const icon = techIcon(label);

  return (
    <span
      className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-accent-border bg-accent-bg px-3 py-2 font-body text-[13px] leading-none font-medium whitespace-nowrap"
    >
      {icon ? <TechGlyph icon={icon} size={16} /> : null}
      {label}
    </span>
  );
}

function GroupName({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2.5 font-display text-[13px] leading-none font-semibold">
      {children}
    </div>
  );
}

/**
 * Berapa pil minimal per separuh track. Grup terpendek hanya 7 item — kalau
 * separuhnya lebih sempit dari wadahnya, item yang sama terlihat dua kali
 * sekaligus di layar. Diulang sampai cukup lebar dulu, baru digandakan.
 */
const MIN_PER_HALF = 14;

/**
 * Satu pita bergerak. Isinya digandakan di dalam track yang sama dan track-nya
 * bergeser tepat -50%, jadi separuh kedua menggantikan separuh pertama tanpa
 * lompatan. Hanya pass pertama yang terbaca screen reader; sisanya
 * `aria-hidden` supaya nama skill tidak dibacakan berkali-kali.
 */
function MarqueeRow({
  group,
  speed,
  reverse,
}: {
  group: SkillGroup;
  speed: string;
  reverse: boolean;
}) {
  const passes = Math.max(1, Math.ceil(MIN_PER_HALF / group.items.length));

  const half = (hidden: boolean) =>
    Array.from({ length: passes }, (_, pass) => (
      <div
        key={pass}
        className="flex gap-2.5"
        {...(hidden || pass > 0 ? { "aria-hidden": true } : {})}
      >
        {group.items.map((item) => (
          <SkillPill key={item} label={item} />
        ))}
      </div>
    ));

  return (
    <div
      // Mask supaya pil tidak terpotong mendadak di kedua tepi.
      className="group/row min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_56px,black_calc(100%-56px),transparent)]"
    >
      <div
        style={{ "--speed": speed } as React.CSSProperties}
        // Pita yang tidak bisa dibaca karena terus bergerak adalah pita yang
        // gagal: berhenti saat disentuh kursor atau saat ada fokus di dalamnya.
        className={`flex w-max animate-marquee py-1 group-hover/row:[animation-play-state:paused] focus-within:[animation-play-state:paused] ${
          // Arah kiri→kanan cukup lewat animation-direction: keyframe-nya sama,
          // jadi seam-nya tetap mulus tanpa perlu keyframe kedua.
          reverse ? "[animation-direction:reverse]" : ""
        }`}
      >
        {/*
         * Jarak antar separuh dibuat lewat `pe-2.5` di dalam masing-masing
         * separuh, BUKAN `gap` di track — dan ini bukan gaya-gayaan.
         *
         * Dengan `gap` di track, lebarnya jadi 2W + gap sementara animasinya
         * bergeser -50%, yaitu W + gap/2. Meleset setengah gap tiap putaran,
         * dan itulah sentakan kecil yang terlihat di setiap sambungan. Dengan
         * paddingnya ikut terhitung ke dalam separuh, tiap separuh persis 50%
         * dari track dan -50% mendarat tepat di awal separuh kedua.
         */}
        <div className="flex gap-2.5 pe-2.5">{half(false)}</div>
        <div className="flex gap-2.5 pe-2.5" aria-hidden="true">
          {half(true)}
        </div>
      </div>
    </div>
  );
}

export function Skills({ groups }: { groups: SkillGroup[] }) {
  const { t } = useLang();
  const reduced = useReducedMotion() ?? false;
  const [showAll, setShowAll] = useState(false);

  // Kalau pengguna minta gerakan dikurangi, langsung tampilkan daftar penuh —
  // bukan animasi yang dijalankan lalu dimatikan.
  const asGrid = reduced || showAll;

  return (
    <TwoColSection
      id="skills"
      eyebrow={t(UI.eyebrowSkills)}
      className="border-t border-[var(--color-line-soft)] bg-surface"
    >
      <AutoHeight animate={!reduced}>
        {/*
         * `key` yang ikut berganti membuat React memasang ulang blok ini, dan
         * `initial` opacity-nya memudarkan keadaan baru masuk sementara tinggi
         * wadahnya masih meluncur. Tanpa itu isinya bertukar dalam satu frame
         * di tengah tinggi yang sedang bergerak — persis yang terasa kasar.
         */}
        {/* role="group": aria-label pada <div> polos tidak terekspos sama sekali. */}
        <motion.div
          key={asGrid ? "grid" : "reel"}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="grid min-w-0 gap-6"
          role="group"
          aria-label={t(UI.skillsRegion)}
        >
          {groups.map((group, i) => (
            <div key={group.id} className="min-w-0">
              <GroupName>{t(group.name)}</GroupName>
              {asGrid ? (
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((item) => (
                    <SkillPill key={item} label={item} />
                  ))}
                </div>
              ) : (
                <MarqueeRow
                  group={group}
                  speed={ROWS[i % ROWS.length].speed}
                  reverse={ROWS[i % ROWS.length].reverse}
                />
              )}
            </div>
          ))}
        </motion.div>
      </AutoHeight>

      {/* Tanpa animasi, tombolnya tidak mengontrol apa pun — jadi tidak dirender. */}
      {reduced ? null : (
        <button
          type="button"
          aria-pressed={showAll}
          onClick={() => setShowAll((v) => !v)}
          className="mt-7 cursor-pointer rounded-lg border border-[var(--color-line-strong)] px-[18px] py-3 font-display text-[13px] leading-none font-semibold transition-colors duration-200 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
        >
          {t(showAll ? UI.skillsShowMarquee : UI.skillsShowAll)}
        </button>
      )}
    </TwoColSection>
  );
}
