"use client";

import { ViewTransition } from "react";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { externalHref } from "@/lib/utils";
import { CtaLink } from "@/components/ui/CtaLink";
import { TagPill } from "@/components/ui/Primitives";
import { TechIcons } from "@/components/ui/TechIcons";
import { MediaViewer } from "./MediaViewer";
import type { Project } from "@/lib/types";

/**
 * Isi halaman detail. Setiap blok di bawah judul hanya dirender kalau datanya
 * ada, jadi proyek yang baru diisi sebagian tetap tampil rapi — bukan kerangka
 * kosong dengan heading yang menggantung.
 */
export function ProjectDetail({ project, backHref = "/#projects" }: { project: Project; backHref?: string }) {
  const { lang, t } = useLang();
  const highlights = lang === "ID" ? project.highlights.id : project.highlights.en;
  // Galeri kosong = pakai screenshot tunggal, seperti gambar utama dulu.
  const images = project.imageUrls.length
    ? project.imageUrls
    : project.imageUrl
      ? [project.imageUrl]
      : [];

  return (
    <article className="section-x section-inner py-12 md:py-16">
      <Link
        href={backHref}
        className="inline-block rounded font-body text-sm font-medium text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
      >
        ← {backHref === "/projects" ? t(UI.backToProjects) : t(UI.backHome)}
      </Link>

      <header className="mt-6 mb-10 max-w-[760px]">
        {project.badges.length ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {project.badges.map((badge, i) => (
              <TagPill key={badge} accent={project.accentBadge && i === 0}>
                {badge}
              </TagPill>
            ))}
          </div>
        ) : null}

        <h1 className="mt-0 mb-4 font-display text-[clamp(30px,6vw,44px)] leading-[1.08] font-semibold tracking-[-0.03em]">
          {project.title}
        </h1>

        <p className="mt-0 mb-5 font-body text-[17px] leading-[1.65] font-normal text-body">
          {t(project.summary)}
        </p>

        <TechIcons items={project.tech} />
      </header>

      {/* Media utama — pasangan morph dari thumbnail kartu proyek. */}
      <ViewTransition
        name={`project-${project.slug}`}
        share="morph"
        default="none"
      >
        <MediaViewer title={project.title} videoUrl={project.videoUrl} images={images} />
      </ViewTransition>

      <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
        <div className="min-w-0">
          {t(project.overview) ? (
            <section className="mb-10">
              <h2 className="mt-0 mb-3 font-mono text-xs leading-none font-semibold text-muted-2">
                {t(UI.overview).toUpperCase()}
              </h2>
              <p className="whitespace-pre-line m-0 max-w-[640px] font-body text-[16px] leading-[1.75] font-normal text-body-2">
                {t(project.overview)}
              </p>
            </section>
          ) : null}

          {highlights.length ? (
            <section className="mb-10">
              <h2 className="mt-0 mb-3 font-mono text-xs leading-none font-semibold text-muted-2">
                {t(UI.highlights).toUpperCase()}
              </h2>
              <ul className="m-0 grid max-w-[640px] list-none gap-2.5 p-0">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="grid grid-cols-[auto_1fr] gap-3 font-body text-[15px] leading-[1.65] text-body-2"
                  >
                    <span aria-hidden="true" className="text-accent-solid">
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {/* Fakta ringkas + tautan */}
        {project.facts.length || project.githubUrl || project.liveUrl ? (
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
            {project.facts.length ? (
              <dl className="m-0 grid border-t border-[var(--color-line-strong)]">
                {project.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="border-b border-[var(--color-line)] py-3.5"
                  >
                    <dt className="mb-1.5 font-mono text-[11px] leading-none font-semibold text-muted-2">
                      {fact.label}
                    </dt>
                    <dd className="m-0 font-body text-[15px] leading-[1.5] font-medium">
                      {t(fact.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {/*
              Sepasang seperti CTA di hero: gelap untuk aksi utama, biru untuk
              yang kedua — bentuk yang sama dengan "View projects" dan
              "Download CV", jadi tombol yang berperan sama terlihat sama di
              seluruh situs.
            */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {project.liveUrl ? (
                <CtaLink
                  href={externalHref(project.liveUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t(UI.visitSite)}
                </CtaLink>
              ) : null}
              {project.githubUrl ? (
                <CtaLink
                  variant="accent"
                  href={externalHref(project.githubUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t(UI.github)}
                </CtaLink>
              ) : null}
            </div>
          </aside>
        ) : null}
      </div>
    </article>
  );
}
