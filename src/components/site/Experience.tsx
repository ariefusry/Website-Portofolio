"use client";

import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { TwoColSection } from "@/components/ui/Primitives";
import type { Experience as ExperienceType } from "@/lib/types";

export function Experience({ items }: { items: ExperienceType[] }) {
  const { t } = useLang();

  return (
    <TwoColSection
      id="experience"
      eyebrow={t(UI.eyebrowExperience)}
      className="border-t border-[var(--color-line-soft)]"
    >
      <div className="border-b border-[var(--color-line)]">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid gap-2 border-t border-[var(--color-line)] py-[22px] sm:grid-cols-[150px_1fr] sm:gap-7"
          >
            <div className="font-mono text-[12.5px] leading-[1.5] font-medium text-muted">
              {t(item.period)}
            </div>
            <div>
              <div className="mb-1.5 font-display text-[18px] leading-[1.3] font-semibold">
                {t(item.role)}
              </div>
              <p className="m-0 max-w-[640px] font-body text-[14.5px] leading-[1.65] font-normal text-body-2">
                {t(item.body)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </TwoColSection>
  );
}
