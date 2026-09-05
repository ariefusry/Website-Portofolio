"use client";

import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { CtaArrow, CtaLink } from "@/components/ui/CtaLink";
import { SmartImage } from "@/components/ui/SmartImage";
import { TechIcons } from "@/components/ui/TechIcons";
import type { Project } from "@/lib/types";

/**
 * Sorotan satu proyek unggulan, tepat sebelum grid Projects.
 * Judulnya memakai kolom `overview` (kalimat headline yang bisa diedit di
 * admin) dan jatuh ke nama proyek selama kolom itu masih kosong.
 */
export function FeaturedBuild({ project }: { project: Project | null }) {
  const { t } = useLang();
  if (!project) return null;

  const headline = t(project.overview) || project.title;
  // Baris pertama galeri adalah gambar utama halaman detail; pakai yang sama di
  // sini supaya sorotan dan halamannya tidak menampilkan screenshot berbeda.
  const image = project.imageUrls[0] ?? project.imageUrl;

  return (
    <section
      id="featured-build"
      className="scroll-anchor section-x border-t border-[var(--color-line-soft)] py-14"
    >
      <div className="mb-4 font-mono text-xs leading-none font-semibold text-accent-ink">
        {t(UI.featuredBuild).toUpperCase()}
      </div>

      {/*
       * Dua kolom di layar lebar, menumpuk di mobile. Gambar diletakkan setelah
       * teks di DOM supaya urutan bacanya tetap judul → ringkasan → screenshot,
       * apa pun lebar layarnya.
       */}
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)] lg:gap-12">
        <div>
          <h2 className="mt-0 mb-4 max-w-[760px] font-display text-[clamp(26px,4.6vw,36px)] leading-[1.12] font-semibold tracking-[-0.03em] text-pretty">
            {headline}
          </h2>

          <p className="mt-0 mb-6 max-w-[600px] font-body text-[16px] leading-[1.7] font-normal text-body-2">
            {t(project.summary)}
          </p>

          <TechIcons items={project.tech} size={20} className="mb-7" />

          <CtaLink href={`/projects/${project.slug}`}>
            {t(UI.readCaseStudy)}
            <CtaArrow />
          </CtaLink>
        </div>

        {/* Sengaja bukan link: tujuannya sama dengan tombol di sebelahnya, dan
            perhentian tab kedua ke halaman yang sama hanya menambah kebisingan. */}
        <div className="rounded-[16px] border border-[var(--color-line)] bg-surface p-3">
          <SmartImage
            src={image}
            alt={`${project.title} — ${t(UI.screenshotOf)}`}
            label={`[ screenshot ${project.title} ]`}
            sizes="(max-width: 1024px) 100vw, 46vw"
            fit="contain"
            className="aspect-[16/9] w-full rounded-xl bg-page"
          />
        </div>
      </div>
    </section>
  );
}
