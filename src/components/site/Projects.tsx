"use client";

import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { CtaArrow, CtaLink } from "@/components/ui/CtaLink";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/types";

/** Berapa kartu yang tampil di beranda sebelum tombol "Explore". */
const HOME_LIMIT = 4;

export function Projects({ projects }: { projects: Project[] }) {
  const { t } = useLang();

  // Proyek yang sedang disorot di Featured Build tidak diulang di grid.
  const inGrid = projects.filter((p) => !p.featured);
  const shown = inGrid.slice(0, HOME_LIMIT);
  const hasMore = projects.length > shown.length;

  return (
    <section
      id="projects"
      className="scroll-anchor section-x border-t border-[var(--color-line-soft)] bg-page py-14"
    >
      <div className="section-inner">
      <div className="mb-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="m-0 font-display text-[clamp(24px,4vw,30px)] leading-[1.1] font-semibold tracking-[-0.025em]">
            {t(UI.projTitle)}
          </h2>
          <span className="font-body text-[13px] leading-none font-medium text-muted">
            {t(UI.projRange)}
          </span>
        </div>
        <p className="mt-2.5 mb-0 max-w-[560px] font-body text-sm leading-[1.6] font-normal text-body-2">
          {t(UI.projLead)}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {shown.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {hasMore ? (
        <div className="mt-10 flex justify-center">
          <CtaLink href="/projects">
            {t(UI.exploreProjects)}
            <CtaArrow />
          </CtaLink>
        </div>
      ) : null}
      </div>
    </section>
  );
}
