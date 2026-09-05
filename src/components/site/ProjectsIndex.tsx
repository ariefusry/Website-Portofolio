"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/types";

/** Paginasi baru berguna kalau proyeknya sudah lebih dari satu layar penuh. */
export const PER_PAGE = 9;

export function ProjectsIndex({
  projects,
  page,
}: {
  projects: Project[];
  page: number;
}) {
  const { t } = useLang();

  const pageCount = Math.max(1, Math.ceil(projects.length / PER_PAGE));
  const current = Math.min(Math.max(page, 1), pageCount);
  const slice = projects.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <div className="section-x py-12 md:py-16">
      <Link
        href="/"
        className="inline-block rounded font-body text-sm font-medium text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
      >
        ← {t(UI.backHome)}
      </Link>

      <h1 className="mt-6 mb-3 font-display text-[clamp(28px,5.5vw,40px)] leading-[1.1] font-semibold tracking-[-0.03em]">
        {t(UI.selectedProjects)}
      </h1>
      <p className="mt-0 mb-10 max-w-[640px] font-body text-[15.5px] leading-[1.7] font-normal text-body-2">
        {t(UI.selectedProjectsLead)}
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {slice.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {pageCount > 1 ? (
        <nav
          aria-label={t(UI.pagination)}
          className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-[var(--color-line)] pt-8"
        >
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={n === 1 ? "/projects" : `/projects?page=${n}`}
              aria-current={n === current ? "page" : undefined}
              className={`min-h-[40px] min-w-[40px] rounded-lg border px-3 py-2.5 text-center font-body text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid ${
                n === current
                  ? "border-ink bg-ink text-on-ink"
                  : "border-[var(--color-line-strong)] hover:border-ink"
              }`}
            >
              {n}
            </Link>
          ))}
          {current < pageCount ? (
            <Link
              href={`/projects?page=${current + 1}`}
              className="min-h-[40px] rounded-lg border border-[var(--color-line-strong)] px-4 py-2.5 font-body text-sm font-semibold transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
            >
              {t(UI.nextPage)} →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
