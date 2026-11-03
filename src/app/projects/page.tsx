import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { LangProvider } from "@/lib/lang-context";
import { Header } from "@/components/site/Header";
import { ProjectsIndex } from "@/components/site/ProjectsIndex";
import { Contact } from "@/components/site/Contact";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Selected Projects",
  description:
    "Web apps and platforms designed, built and shipped by Arief Muhammad Usry: fullstack engineering, data and machine learning.",
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    title: "Selected Projects | Arief Muhammad Usry",
    description:
      "Web apps and platforms designed, built and shipped: fullstack engineering, data and machine learning.",
    url: "/projects",
    siteName: "Arief Muhammad Usry",
    locale: "en_US",
    images: [
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
    title: "Selected Projects | Arief Muhammad Usry",
    description:
      "Web apps and platforms designed, built and shipped: fullstack engineering, data and machine learning.",
    images: ["/opengraph-image"],
  },
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const content = await getContent();
  const parsed = Number.parseInt(page ?? "1", 10);

  return (
    <LangProvider defaultLang={content.settings.defaultLang}>
      <Header email={content.profile.email} />
      <main>
        <ProjectsIndex
          projects={content.projects}
          page={Number.isFinite(parsed) ? parsed : 1}
        />
      </main>
      <Contact profile={content.profile} />
    </LangProvider>
  );
}
