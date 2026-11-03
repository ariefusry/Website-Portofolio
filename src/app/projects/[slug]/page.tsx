import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { LangProvider } from "@/lib/lang-context";
import { Header } from "@/components/site/Header";
import { ProjectDetail } from "@/components/site/ProjectDetail";
import { Contact } from "@/components/site/Contact";
import { externalHref } from "@/lib/utils";

export const revalidate = 60;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ariefusry.me";

/** Halaman detail dipra-render untuk tiap proyek yang ada di CMS. */
export async function generateStaticParams() {
  const { projects } = await getContent();
  return projects.map((p) => ({ slug: p.slug }));
}

async function findProject(slug: string) {
  const content = await getContent();
  return {
    content,
    project: content.projects.find((p) => p.slug === slug) ?? null,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await findProject(slug);
  if (!project) return { title: "Project not found" };

  const description = project.summary.en;
  const image = project.imageUrls[0] ?? project.imageUrl;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} | Arief Muhammad Usry`,
      description,
      url: `/projects/${project.slug}`,
      siteName: "Arief Muhammad Usry",
      locale: "en_US",
      images: image
        ? [{ url: image, alt: `${project.title}, screenshot` }]
        : [
            {
              url: "/opengraph-image",
              width: 1200,
              height: 630,
              alt: "Arief Muhammad Usry | Fullstack Engineer",
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Arief Muhammad Usry`,
      description,
      images: [image ?? "/opengraph-image"],
    },
  };
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { slug } = await params;
  const { from } = await searchParams;
  const { content, project } = await findProject(slug);
  if (!project) notFound();

  const backHref = from === "projects" ? "/projects" : "/#projects";
  const image = project.imageUrls[0] ?? project.imageUrl;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary.en,
    url: `${siteUrl}/projects/${project.slug}`,
    ...(image ? { image } : {}),
    ...(project.tech.length ? { keywords: project.tech.join(", ") } : {}),
    author: {
      "@type": "Person",
      name: "Arief Muhammad Usry",
      url: siteUrl,
    },
    ...(project.liveUrl ? { sameAs: [externalHref(project.liveUrl)] } : {}),
  };

  return (
    <LangProvider defaultLang={content.settings.defaultLang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header email={content.profile.email} />
      <main>
        <ProjectDetail project={project} backHref={backHref} />
      </main>
      <Contact profile={content.profile} />
    </LangProvider>
  );
}
