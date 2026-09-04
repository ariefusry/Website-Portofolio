import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { LangProvider } from "@/lib/lang-context";
import { Header } from "@/components/site/Header";
import { ProjectDetail } from "@/components/site/ProjectDetail";
import { Contact } from "@/components/site/Contact";

export const revalidate = 60;

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
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} — Arief M. Usry`,
      description,
      url: `/projects/${project.slug}`,
    },
    twitter: { card: "summary_large_image", title: project.title, description },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { content, project } = await findProject(slug);
  if (!project) notFound();

  return (
    <LangProvider defaultLang={content.settings.defaultLang}>
      <Header name={content.profile.name} email={content.profile.email} />
      <main>
        <ProjectDetail project={project} />
      </main>
      <Contact profile={content.profile} />
    </LangProvider>
  );
}
