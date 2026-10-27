"use client";

import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { TwoColSection } from "@/components/ui/Primitives";
import type { SkillGroup } from "@/lib/types";

export function Skills({ groups }: { groups: SkillGroup[] }) {
  const { t } = useLang();

  return (
    <TwoColSection
      id="skills"
      eyebrow={t(UI.eyebrowSkills)}
      className="border-t border-[var(--color-line-soft)] bg-surface"
    >
      {/* role="group": aria-label pada <div> polos tidak terekspos sama sekali. */}
      <dl
        className="m-0 grid border-t border-[var(--color-line-strong)]"
        role="group"
        aria-label={t(UI.skillsRegion)}
      >
        {groups.map((group) => (
          // Bentuknya sama dengan baris fakta di About: label kiri, teks kanan.
          <div
            key={group.id}
            className="grid gap-1.5 border-b border-[var(--color-line)] py-3.5 sm:grid-cols-[200px_1fr] sm:gap-6"
          >
            <dt className="font-mono text-[11px] leading-[1.5] font-semibold uppercase text-muted-2 sm:pt-[3px]">
              {t(group.name)}
            </dt>
            <dd className="m-0 font-body text-[15px] leading-[1.6] font-medium">
              {group.items.join(", ")}
            </dd>
          </div>
        ))}
      </dl>
    </TwoColSection>
  );
}
