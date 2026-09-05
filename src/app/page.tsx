import { getContent } from "@/lib/content";
import { LangProvider } from "@/lib/lang-context";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { FeaturedBuild } from "@/components/site/FeaturedBuild";
import { Projects } from "@/components/site/Projects";
import { Research } from "@/components/site/Research";
import { Experience } from "@/components/site/Experience";
import { Skills } from "@/components/site/Skills";
import { Contact } from "@/components/site/Contact";

/** Perubahan dari dashboard admin muncul tanpa deploy ulang. */
export const revalidate = 60;

export default async function Home() {
  const content = await getContent();
  const { profile, settings } = content;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Arief Muhammad Usry",
    alternateName: profile.name,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    jobTitle: "Fullstack Engineer",
    description: profile.about.en,
    address: { "@type": "PostalAddress", addressLocality: "Bekasi", addressCountry: "ID" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Telkom University" },
    knowsAbout: ["Flutter", "Laravel", "Supabase", "PostgreSQL", "Machine Learning"],
    sameAs: [`https://${profile.linkedin}`, `https://${profile.github}`],
  };

  return (
    <LangProvider defaultLang={settings.defaultLang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header name={profile.name} email={profile.email} />
      <main>
        <Hero profile={profile} />
        <About profile={profile} tracks={content.tracks} />
        <FeaturedBuild
          project={content.projects.find((p) => p.featured) ?? null}
        />
        <Experience items={content.experiences} />
        <Projects projects={content.projects} />
        <Skills groups={content.skillGroups} />
        <Research research={content.research} />
      </main>
      <Contact profile={profile} />
    </LangProvider>
  );
}
