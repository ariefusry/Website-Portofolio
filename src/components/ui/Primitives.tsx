/** Label mono kecil di kolom kiri tiap section. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-1.5 font-mono text-xs leading-none font-semibold text-muted-2">
      {children}
    </div>
  );
}

/** Chip teknologi / skill. */
export function Chip({
  children,
  accent = false,
  outlined = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
  outlined?: boolean;
}) {
  const tone = outlined
    ? "border border-[var(--color-line-strong)]"
    : accent
      ? "bg-accent-chip"
      : "bg-page";

  return (
    <span
      className={`rounded-[5px] px-2.5 py-[5px] font-body text-[11.5px] leading-none font-medium ${tone}`}
    >
      {children}
    </span>
  );
}

/** Badge mono di atas judul proyek. */
export function TagPill({
  children,
  accent = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  const tone = accent
    ? "bg-accent-bg text-accent-ink"
    : "bg-[var(--color-line)] text-muted";

  return (
    <span
      className={`rounded-[5px] px-2.5 py-[5px] font-mono text-[10.5px] leading-none font-semibold ${tone}`}
    >
      {children}
    </span>
  );
}

/**
 * Kerangka section dua kolom (label kiri 200px + isi kanan) yang menumpuk di mobile.
 */
export function TwoColSection({
  id,
  eyebrow,
  children,
  className = "",
}: {
  id?: string;
  eyebrow: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-anchor section-x py-14 ${className}`}
    >
      <div className="grid gap-8 md:grid-cols-[200px_1fr] md:gap-12">
        <Eyebrow>{eyebrow}</Eyebrow>
        {/* min-w-0: tanpa ini grid item memakai min-width:auto, dan isi yang
            lebih lebar (mis. pita skill) melebarkan halaman alih-alih terpotong. */}
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
