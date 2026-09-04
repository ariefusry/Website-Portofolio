/**
 * Isian dashed-diagonal untuk aset yang belum diunggah (foto profil, screenshot).
 * Begitu path aset ada di Supabase, SmartImage merender gambar aslinya.
 */
export function Placeholder({
  label,
  dark = false,
  className = "",
}: {
  label?: string;
  dark?: boolean;
  className?: string;
}) {
  const fill = dark
    ? "repeating-linear-gradient(135deg,#23272b 0 6px,#2b3035 6px 12px)"
    : "repeating-linear-gradient(135deg,#e6e9ec 0 6px,#eef1f3 6px 12px)";

  return (
    <div
      className={`flex items-end p-4 ${className}`}
      style={{ background: fill }}
      aria-hidden="true"
    >
      {label ? (
        <span className="font-mono text-[11px] leading-none text-[#7c868f]">
          {label}
        </span>
      ) : null}
    </div>
  );
}
