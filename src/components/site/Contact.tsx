"use client";

import { useLang } from "@/lib/lang-context";
import type { Profile } from "@/lib/types";

export function Contact({ profile }: { profile: Profile }) {
  const { t } = useLang();

  const links = [
    { label: profile.phone, href: `tel:${profile.phone.replace(/[^\d+]/g, "")}` },
    { label: profile.linkedin, href: `https://${profile.linkedin}` },
    { label: profile.github, href: `https://${profile.github}` },
  ];

  return (
    <footer className="section-x flex flex-wrap items-end justify-between gap-10 bg-dark-bg py-16 text-dark-text">
      <div>
        <h2 className="mt-0 mb-3.5 max-w-[620px] font-display text-[clamp(28px,5vw,40px)] leading-[1.1] font-semibold tracking-[-0.03em]">
          {t(profile.contactHeading)}
        </h2>
        <p className="m-0 font-body text-[15.5px] leading-[1.6] font-normal text-dark-2">
          {t(profile.contactNote)}
        </p>
      </div>

      <div className="grid gap-2.5 font-mono text-sm leading-none font-medium">
        <a href={`mailto:${profile.email}`} className="hover:underline">
          {profile.email}
        </a>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-dark-2 transition-colors hover:text-dark-text"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
