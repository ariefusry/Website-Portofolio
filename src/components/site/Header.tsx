"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/lang-context";
import { UI } from "@/lib/i18n";
import { useTheme } from "@/lib/theme-context";
import { Moon, Sun } from "lucide-react";
import { SpotlightNavItem, SpotlightPill } from "@/components/ui/spotlight-navbar";

/** Pemisah tipis antar kelompok di dalam pil. */
function Divider() {
  return (
    <span
      aria-hidden="true"
      className="h-5 w-px shrink-0 bg-[var(--color-line-strong)]"
    />
  );
}

const NAV = [
  { id: "about", label: UI.nav.about },
  { id: "experience", label: UI.nav.experience },
  { id: "projects", label: UI.nav.projects },
  { id: "research", label: UI.nav.research },
] as const;

export function Header({ name, email }: { name: string; email: string }) {
  const { lang, setLang, t } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();
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

  /*
   * Satu tombol, bukan dua: keduanya melakukan hal yang sama — berpindah ke
   * bahasa satunya — jadi memisahkannya hanya menambah perhentian tab tanpa
   * menambah pilihan. Isinya `aria-hidden` dan tombolnya membawa aria-label,
   * kalau tidak screen reader membacakan "EN ID" yang tidak berarti apa-apa.
   *
   * Kedua label selalu dirender, jadi lebarnya tetap saat bahasa berganti dan
   * pil navbar tidak ikut melompat.
   */
  const langToggle = (
    <button
      type="button"
      onClick={() => setLang(other)}
      aria-label={`${t(UI.switchLang)}: ${other}`}
      className="relative flex cursor-pointer items-center rounded-full bg-[var(--color-line)] p-[3px] font-mono text-[11px] leading-none font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
    >
      {/* Thumb yang meluncur; lebarnya persis satu sel label. */}
      <span
        aria-hidden="true"
        className={`absolute top-[3px] bottom-[3px] left-[3px] w-[calc(50%-3px)] rounded-full bg-ink transition-transform duration-300 ease-[var(--ease-brand)] motion-reduce:transition-none ${
          lang === "EN" ? "translate-x-0" : "translate-x-full"
        }`}
      />
      {(["EN", "ID"] as const).map((code) => (
        <span
          key={code}
          aria-hidden="true"
          className={`relative z-10 w-1/2 px-[9px] py-[5px] text-center transition-colors duration-300 motion-reduce:transition-none ${
            lang === code ? "text-on-ink" : "text-muted"
          }`}
        >
          {code}
        </span>
      ))}
    </button>
  );

  // Ikon menunjukkan tema yang akan dituju, bukan yang sedang aktif — itu yang
  // dicari orang saat menekannya. Label-nya juga menyebut tujuan.
  const themeToggle = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t(theme === "dark" ? UI.themeToLight : UI.themeToDark)}
      className="cursor-pointer rounded-full border border-[var(--color-line-strong)] p-2 text-muted transition-colors hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" className="h-4 w-4" />
      ) : (
        <Moon aria-hidden="true" className="h-4 w-4" />
      )}
    </button>
  );

  const hireBtn = (
    <a
      href={`mailto:${email}`}
      className="rounded-full bg-ink px-[15px] py-2 font-semibold text-on-ink transition-transform duration-200 hover:-translate-y-[1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
    >
      {t(UI.hire)}
    </a>
  );

  return (
    /*
     * Header melayang: bandnya tetap sticky dan tetap memakan tinggi di alur
     * dokumen — `--header-h` dan scroll-margin tiap section bergantung padanya —
     * tapi latarnya transparan, sehingga yang terlihat mengambang hanyalah
     * pil-pilnya dan konten lewat di belakangnya.
     */
    <header className="sticky top-0 z-30">
      <div className="section-x flex justify-center py-[14px]">
        {/* Desktop: satu pil berisi nama, nav, dan kontrol. */}
        <SpotlightPill className="nav-pill hidden items-center gap-2 py-1.5 pr-2 pl-5 lg:flex">
          <Link
            href="/"
            className="rounded-full font-display text-[15px] leading-none font-semibold tracking-[-0.01em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
          >
            {name}
          </Link>

          <Divider />

          <nav className="font-body text-[13px] leading-none font-medium text-muted">
            <ul className="m-0 flex list-none items-center p-0">
              {items.map((n) => (
                <SpotlightNavItem key={n.id} active={active === n.id}>
                  <Link
                    href={hrefFor(n.id)}
                    aria-current={active === n.id ? "true" : undefined}
                    className={`rounded-full px-3.5 py-3 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid ${
                      active === n.id ? "text-ink" : ""
                    }`}
                  >
                    {t(n.label)}
                  </Link>
                </SpotlightNavItem>
              ))}
            </ul>
          </nav>

          <Divider />

          <div className="flex items-center gap-2 font-body text-[13px] leading-none font-medium">
            {langToggle}
            {themeToggle}
            {hireBtn}
          </div>
        </SpotlightPill>

        {/* Mobile: pil yang sama, isinya nama dan kontrol saja. */}
        <SpotlightPill className="nav-pill flex items-center gap-2 py-1.5 pr-2 pl-4 font-body text-[13px] leading-none font-medium lg:hidden">
          <Link
            href="/"
            className="rounded-full font-display text-[15px] leading-none font-semibold tracking-[-0.01em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
          >
            {name}
          </Link>
          <Divider />
          {langToggle}
          {themeToggle}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t(UI.menu)}
            aria-expanded={open}
            className="cursor-pointer rounded-full px-2 py-1 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-solid"
          >
            {t(UI.menu)}
          </button>
        </SpotlightPill>
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
              className="mt-6 rounded-lg bg-ink px-5 py-4 text-center font-display font-semibold text-on-ink"
            >
              {t(UI.hire)}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
