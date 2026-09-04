"use client";

import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { Chip, TagPill } from "@/components/ui/Primitives";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Project } from "@/lib/types";

function FeaturedCard({ project }: { project: Project }) {
  const { t } = useLang();

  return (
    <article className="grid overflow-hidden rounded-[14px] border border-[var(--color-line)] bg-page md:col-span-2 md:grid-cols-2">
      <SmartImage
        src={project.imageUrl}
        alt={project.title}
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
        <div className="flex gap-[18px] font-display text-[13px] leading-none font-semibold">
          <a
            href="#case-study"
            className="border-b border-current pb-0.5 transition-colors hover:text-accent-ink"
          >
            {t(UI.caseStudy)}
          </a>
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-ink"
            >
              {t(UI.github)}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function SmallCard({ project }: { project: Project }) {
  const { t } = useLang();

  return (
    <article className="overflow-hidden rounded-[14px] border border-[var(--color-line)] bg-page">
      {project.hasThumb ? (
        <SmartImage
          src={project.imageUrl}
          alt={project.title}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-[150px] w-full"
        />
      ) : null}
      <div className="p-[22px]">
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
        <p className="m-0 font-body text-[13.5px] leading-[1.6] font-normal text-body-2">
          {t(project.summary)}
        </p>
      </div>
    </article>
  );
}

export function Work({ projects }: { projects: Project[] }) {
  const { t } = useLang();
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section
      id="work"
      className="scroll-anchor section-x border-t border-[var(--color-line-soft)] bg-surface py-14"
    >
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 className="m-0 font-display text-[clamp(24px,4vw,30px)] leading-[1.1] font-semibold tracking-[-0.025em]">
          {t(UI.projTitle)}
        </h2>
        <span className="font-body text-[13px] leading-none font-medium text-muted">
          {t(UI.projRange)}
        </span>
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
