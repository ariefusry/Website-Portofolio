import { getContent } from "@/lib/content";
import { LangProvider } from "@/lib/lang-context";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { StatStrip } from "@/components/site/StatStrip";
import { About } from "@/components/site/About";
import { Work } from "@/components/site/Work";
import { CaseStudy } from "@/components/site/CaseStudy";
import { Research } from "@/components/site/Research";
import { Experience } from "@/components/site/Experience";
import { Skills } from "@/components/site/Skills";
import { Writing } from "@/components/site/Writing";
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
      <Header
        name={profile.name}
        email={profile.email}
        showBlog={settings.showBlog}
      />
      <main>
        <Hero profile={profile} />
        <StatStrip stats={content.stats} />
        <About profile={profile} tracks={content.tracks} />
        <Work projects={content.projects} />
        <CaseStudy caseStudy={content.caseStudy} />
        <Research research={content.research} />
        <Experience items={content.experiences} />
        <Skills groups={content.skillGroups} />
        {settings.showBlog ? <Writing posts={content.posts} /> : null}
      </main>
      <Contact profile={profile} />
    </LangProvider>
  );
}
