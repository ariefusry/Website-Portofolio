"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";

const NAV = [
  { id: "about", label: UI.nav.about },
  { id: "experience", label: UI.nav.experience },
  { id: "projects", label: UI.nav.projects },
  { id: "research", label: UI.nav.research },
] as const;

export function Header({ name, email }: { name: string; email: string }) {
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [observed, setObserved] = useState<string>("");
  // Sorotan nav hanya berlaku di beranda — diturunkan saat render, bukan
  // di-reset lewat setState di dalam effect.
  const active = onHome ? observed : "";
  const [open, setOpen] = useState(false);

  const items = useMemo(() => NAV, []);

  // Di luar beranda, anchor harus menyeberang halaman dulu ("/#about"),
  // kalau tidak link-nya tidak menuju ke mana-mana.
  const hrefFor = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  useEffect(() => {
    if (!onHome) return;
    const sections = items
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setObserved(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items, onHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const other = lang === "EN" ? "ID" : "EN";

  const langToggle = (
    <div className="flex gap-0.5 rounded-full bg-black/[0.06] p-[3px] font-mono text-[11px] leading-none font-semibold">
      <span className="rounded-full bg-ink px-[9px] py-[5px] text-white">
        {lang}
      </span>
      <button
        type="button"
        onClick={() => setLang(other)}
        aria-label={`${t(UI.switchLang)}: ${other}`}
        className="cursor-pointer rounded-full px-[9px] py-[5px] text-[#5b6570] transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
      >
        {other}
      </button>
    </div>
  );

  const hireBtn = (
    <a
      href={`mailto:${email}`}
      className="rounded-full bg-ink px-[15px] py-2 font-semibold text-white transition-transform duration-200 hover:-translate-y-[1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
    >
      {t(UI.hire)}
    </a>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-line-soft)] bg-white/70 backdrop-blur-md">
      <div className="section-x flex items-center justify-between py-[18px]">
        <Link
          href="/"
          className="rounded font-display text-[15px] leading-none font-semibold tracking-[-0.01em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
        >
          {name}
        </Link>

        <nav className="hidden items-center gap-7 font-body text-[13px] leading-none font-medium text-[#5b6570] lg:flex">
          {items.map((n) => (
            <Link
              key={n.id}
              href={hrefFor(n.id)}
              aria-current={active === n.id ? "true" : undefined}
              className={`rounded transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid ${
                active === n.id ? "text-ink" : ""
              }`}
            >
              {t(n.label)}
            </Link>
          ))}
          {langToggle}
          {hireBtn}
        </nav>

        <div className="flex items-center gap-3 font-body text-[13px] leading-none font-medium lg:hidden">
          {langToggle}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t(UI.menu)}
            aria-expanded={open}
            className="rounded-lg border border-[var(--color-line-strong)] px-3 py-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
          >
            {t(UI.menu)}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-40 bg-page lg:hidden">
          <div className="section-x flex items-center justify-between border-b border-[var(--color-line-soft)] py-[18px]">
            <span className="font-display text-[15px] leading-none font-semibold">
              {name}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t(UI.closeMenu)}
              className="rounded-lg border border-[var(--color-line-strong)] px-3 py-2 font-body text-[13px] leading-none font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
            >
              ✕
            </button>
          </div>
          <nav className="section-x flex flex-col gap-1 py-6">
            {items.map((n) => (
              <Link
                key={n.id}
                href={hrefFor(n.id)}
                onClick={() => setOpen(false)}
                className="border-b border-[var(--color-line)] py-4 font-display text-2xl font-semibold tracking-[-0.02em]"
              >
                {t(n.label)}
              </Link>
            ))}
            <a
              href={`mailto:${email}`}
              onClick={() => setOpen(false)}
              className="mt-6 rounded-lg bg-ink px-5 py-4 text-center font-display font-semibold text-white"
            >
              {t(UI.hire)}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
