"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { Chip, TagPill } from "@/components/ui/Primitives";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Project } from "@/lib/types";

/**
 * Seluruh permukaan kartu adalah satu <Link>, jadi hanya ada satu target tab
 * per proyek dan urutan tab mengikuti urutan visual. Focus ring dibuat jelas
 * (bukan outline-none) karena kartu ini satu-satunya kontrol di grid.
 */
const CARD_BASE =
  "group relative block overflow-hidden rounded-[14px] border border-[var(--color-line)] bg-page transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid motion-reduce:transition-none motion-reduce:hover:translate-y-0";

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
    >
      →
    </span>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  const { t } = useLang();

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`${CARD_BASE} md:col-span-2 md:grid md:grid-cols-2`}
    >
      <SmartImage
        src={project.imageUrl}
        alt=""
        label={`[ screenshot ${project.title} ]`}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="min-h-[220px] md:min-h-[280px]"
      />
      <div className="p-6 md:p-[34px]">
        <div className="mb-4 flex flex-wrap gap-2">
          {project.badges.map((badge, i) => (
            <TagPill key={badge} accent={project.accentBadge && i === 0}>
              {badge}
            </TagPill>
          ))}
        </div>
        <h3 className="mt-0 mb-2.5 font-display text-2xl leading-[1.2] font-semibold tracking-[-0.02em]">
          {project.title}
        </h3>
        <p className="mt-0 mb-5 font-body text-[14.5px] leading-[1.65] font-normal text-body-2">
          {t(project.summary)}
        </p>
        <div className="mb-[22px] flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <Chip key={tech} outlined>
              {tech}
            </Chip>
          ))}
        </div>
        <span className="font-display text-[13px] leading-none font-semibold">
          {t(UI.viewProject)}
          <Arrow />
        </span>
      </div>
    </Link>
  );
}

function SmallCard({ project }: { project: Project }) {
  const { t } = useLang();

  return (
    <Link href={`/projects/${project.slug}`} className={`${CARD_BASE} flex flex-col`}>
      {project.hasThumb ? (
        <SmartImage
          src={project.imageUrl}
          alt=""
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-[150px] w-full"
        />
      ) : null}
      <div className="flex flex-1 flex-col p-[22px]">
        <div
          className={`mb-2.5 font-mono text-[10.5px] leading-none font-semibold ${
            project.accentBadge ? "text-accent-ink" : "text-muted-2"
          }`}
        >
          {project.badges.join(" · ")}
        </div>
        <h3 className="mt-0 mb-2 font-display text-[19px] leading-[1.2] font-semibold">
          {project.title}
        </h3>
        <p className="mt-0 mb-4 font-body text-[13.5px] leading-[1.6] font-normal text-body-2">
          {t(project.summary)}
        </p>
        <span className="mt-auto font-display text-[13px] leading-none font-semibold">
          {t(UI.viewProject)}
          <Arrow />
        </span>
      </div>
    </Link>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  const { t } = useLang();
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      className="scroll-anchor section-x border-t border-[var(--color-line-soft)] bg-surface py-14"
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
        {featured.map((p) => (
          <FeaturedCard key={p.id} project={p} />
        ))}
        {rest.map((p) => (
          <SmallCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}
