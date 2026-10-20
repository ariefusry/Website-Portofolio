"use client";

import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { TwoColSection } from "@/components/ui/Primitives";
import type { Profile } from "@/lib/types";

export function About({ profile }: { profile: Profile }) {
  const { t } = useLang();

  return (
    <TwoColSection
      id="about"
      eyebrow={t(UI.eyebrowAbout)}
      // Garis pemisah dari hero. Memakai border-t seperti section lain, bukan
      // elemen pemisah tersendiri, supaya semua batas section tetap seragam.
      className="border-t border-[var(--color-line-soft)]"
    >
      <p className="whitespace-pre-line mt-0 mb-8 max-w-[700px] font-body text-[17.5px] leading-[1.7] font-normal text-body text-pretty">
        {t(profile.about)}
      </p>

      {/* Bentuknya sama dengan "Fakta ringkas" di halaman detail proyek. */}
      {profile.aboutFacts.length ? (
        <dl className="m-0 grid max-w-[700px] border-t border-[var(--color-line-strong)]">
          {profile.aboutFacts.map((fact) => (
            <div
              key={fact.label}
              className="grid gap-1.5 border-b border-[var(--color-line)] py-3.5 sm:grid-cols-[160px_1fr] sm:gap-6"
            >
              <dt className="font-mono text-[11px] leading-[1.5] font-semibold text-muted-2 sm:pt-[3px]">
                {fact.label}
              </dt>
              <dd className="m-0 font-body text-[15px] leading-[1.5] font-medium">
                {t(fact.value)}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </TwoColSection>
  );
}
