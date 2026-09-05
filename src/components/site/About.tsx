"use client";

import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { Chip, TwoColSection } from "@/components/ui/Primitives";
import type { Profile, Track } from "@/lib/types";

export function About({
  profile,
  tracks,
}: {
  profile: Profile;
  tracks: Track[];
}) {
  const { t } = useLang();

  return (
    <TwoColSection id="about" eyebrow={t(UI.eyebrowAbout)}>
      <p className="mt-0 mb-8 max-w-[700px] font-body text-[17.5px] leading-[1.7] font-normal text-body text-pretty">
        {t(profile.about)}
      </p>

      <div className="mb-3.5 font-mono text-xs leading-none font-semibold text-muted-2">
        {t(UI.trackLabel)}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`rounded-xl bg-surface p-6 ${
              track.accent
                ? "border border-accent-border"
                : "border border-[var(--color-line)]"
            }`}
          >
            <div className="mb-2.5 font-display text-[17px] leading-[1.25] font-semibold">
              {t(track.title)}
            </div>
            <p className="mt-0 mb-4 font-body text-sm leading-[1.6] font-normal text-body-2">
              {t(track.body)}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {track.chips.map((chip) => (
                <Chip key={chip} accent={track.accent}>
                  {chip}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </TwoColSection>
  );
}
