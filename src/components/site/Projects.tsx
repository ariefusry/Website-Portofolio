"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
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
          <Link
            href="/projects"
            className="group inline-flex items-center rounded-full bg-ink px-6 py-3.5 font-display text-sm leading-none font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {t(UI.exploreProjects)}
            <span
              aria-hidden="true"
              className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            >
              →
            </span>
          </Link>
        </div>
      ) : null}
    </section>
  );
}
