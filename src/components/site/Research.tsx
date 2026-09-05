"use client";

import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { TwoColSection } from "@/components/ui/Primitives";
import type { Research as ResearchType } from "@/lib/types";

export function Research({ research }: { research: ResearchType }) {
  const { t } = useLang();

  return (
    <TwoColSection
      id="research"
      eyebrow={t(UI.eyebrowResearch)}
      className="bg-surface"
    >
      <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <div className="mb-4 inline-flex rounded-[5px] bg-accent-strong px-2.5 py-[5px] font-mono text-[10.5px] leading-none font-semibold text-on-accent-strong">
            {research.badge}
          </div>
          <h3 className="mt-0 mb-3 font-display text-2xl leading-[1.25] font-semibold tracking-[-0.02em]">
            {research.title}
          </h3>
          <p className="m-0 max-w-[560px] font-body text-[15px] leading-[1.7] font-normal text-body-2">
            {t(research.body)}
          </p>
        </div>

        <dl className="m-0 grid border-t border-[var(--color-line-strong)]">
          {research.metrics.map((metric, i) => (
            <div
              key={metric.label}
              className={`flex items-baseline justify-between gap-4 py-3.5 ${
                i < research.metrics.length - 1
                  ? "border-b border-[var(--color-line)]"
                  : ""
              }`}
            >
              <dt className="font-mono text-xs leading-none font-medium text-muted-2">
                {metric.label}
              </dt>
              <dd className="m-0 font-display text-[18px] leading-none font-semibold">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </TwoColSection>
  );
}
