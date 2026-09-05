"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
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
        className={`flex w-max animate-marquee gap-2.5 py-1 group-hover/row:[animation-play-state:paused] focus-within:[animation-play-state:paused] ${
          // Arah kiri→kanan cukup lewat animation-direction: keyframe-nya sama,
          // jadi seam-nya tetap mulus tanpa perlu keyframe kedua.
          reverse ? "[animation-direction:reverse]" : ""
        }`}
      >
        <div className="flex gap-2.5">{half(false)}</div>
        <div className="flex gap-2.5" aria-hidden="true">
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
      {/* role="group": aria-label pada <div> polos tidak terekspos sama sekali. */}
      <div className="grid min-w-0 gap-6" role="group" aria-label={t(UI.skillsRegion)}>
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
      </div>

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
