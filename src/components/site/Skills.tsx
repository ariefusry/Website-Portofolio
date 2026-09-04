"use client";

import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { Chip, TwoColSection } from "@/components/ui/Primitives";
import type { SkillGroup } from "@/lib/types";

export function Skills({ groups }: { groups: SkillGroup[] }) {
  const { t } = useLang();

  return (
    <TwoColSection
      id="skills"
      eyebrow={t(UI.eyebrowSkills)}
      className="border-t border-[var(--color-line-soft)] bg-surface"
    >
      <div className="grid gap-5">
        {groups.map((group) => (
          <div key={group.id}>
            <div className="mb-2.5 font-display text-[13px] leading-none font-semibold">
              {t(group.name)}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <Chip key={item} accent={group.accent}>
                  {item}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </TwoColSection>
  );
}
