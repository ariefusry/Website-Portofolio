"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { SmartImage } from "@/components/ui/SmartImage";
import { TechIcons } from "@/components/ui/TechIcons";
import type { Project } from "@/lib/types";

/**
 * Satu kartu proyek, dipakai bersama oleh grid beranda dan halaman /projects.
 *
 * Seluruh permukaan kartu adalah satu <Link> — jadi satu proyek = satu
 * perhentian tab, dan tidak ada link di dalam link. Tautan ke situs live
 * sengaja hanya ada di halaman detail karena alasan yang sama.
 */
export function ProjectCard({ project }: { project: Project }) {
  const { t } = useLang();
  const role = t(project.role);
  const status = t(project.status);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-[14px] border border-[var(--color-line)] bg-surface transition-[transform,border-color,box-shadow] duration-[220ms] ease-[var(--ease-brand)] hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_14px_32px_rgba(0,0,0,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none"
    >
      {project.hasThumb ? (
        // Wadah overflow-hidden supaya zoom gambar tidak menggeser layout;
        // yang dianimasikan hanya transform, bukan width/height.
        <div className="overflow-hidden bg-page p-3 pb-0">
          <SmartImage
            src={project.imageUrl}
            alt=""
            label={`[ screenshot ${project.title} ]`}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-[170px] w-full rounded-lg transition-transform duration-[350ms] ease-[var(--ease-brand)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-[22px]">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <h3 className="m-0 font-display text-[19px] leading-[1.2] font-semibold">
            {project.title}
          </h3>
          {status ? (
            <span className="rounded-[5px] bg-accent-bg px-2 py-1 font-mono text-[10px] leading-none font-semibold tracking-wide text-accent-ink">
              {status}
            </span>
          ) : null}
        </div>

        {/* Baris peran; selama kolom role kosong, badge lama yang dipakai. */}
        <p
          className={`mt-0 mb-2 font-body text-[12.5px] leading-[1.4] font-semibold ${
            project.accentBadge && !role ? "text-accent-ink" : "text-muted"
          }`}
        >
          {role || project.badges.join(" · ")}
        </p>

        <p className="mt-0 mb-4 font-body text-[13.5px] leading-[1.6] font-normal text-body-2">
          {t(project.summary)}
        </p>

        <TechIcons items={project.tech} className="mb-5" />

        <span className="mt-auto font-display text-[13px] leading-none font-semibold">
          {t(UI.viewProject)}
          <span
            aria-hidden="true"
            className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
