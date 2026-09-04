"use client";

import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { SmartImage } from "@/components/ui/SmartImage";
import type { CaseStudy as CaseStudyType } from "@/lib/types";

export function CaseStudy({ caseStudy }: { caseStudy: CaseStudyType }) {
  const { t } = useLang();
  const [hero, ...thumbs] = caseStudy.imageUrls;

  return (
    <section
      id="case-study"
      className="scroll-anchor section-x bg-dark-bg py-14 text-dark-text"
    >
      <div className="mb-6 font-mono text-xs leading-none font-semibold text-accent-dark">
        {t(UI.caseStudy)} — {caseStudy.projectTitle}
      </div>

      <div className="grid items-start gap-10 md:grid-cols-2">
        <div>
          <h2 className="mt-0 mb-[26px] font-display text-[clamp(26px,4.5vw,34px)] leading-[1.12] font-semibold tracking-[-0.028em]">
            {t(caseStudy.heading)}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {caseStudy.facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-[10px] border border-[var(--color-line-dark)] p-[18px]"
              >
                <div className="mb-2 font-mono text-[11px] leading-none font-semibold text-muted-2">
                  {fact.label}
                </div>
                <div className="font-body text-sm leading-[1.5] font-medium">
                  {t(fact.value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <SmartImage
            src={hero ?? null}
            alt={`${caseStudy.projectTitle} — ${t(UI.adminDashboard)}`}
            label={`[ ${t(UI.screenshotOf)} — ${t(UI.adminDashboard)} ]`}
            dark
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-[200px] w-full rounded-[10px]"
          />
          <div className="grid grid-cols-2 gap-3">
            {thumbs.map((url, i) => (
              <SmartImage
                key={i}
                src={url ?? null}
                alt={`${caseStudy.projectTitle} — ${t(UI.screenshotOf)} ${i + 2}`}
                dark
                sizes="(max-width: 768px) 50vw, 25vw"
                className="h-[110px] w-full rounded-[10px]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
