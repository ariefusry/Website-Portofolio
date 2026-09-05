import Image from "next/image";
import { Placeholder } from "./Placeholder";

/**
 * Merender gambar dari Supabase Storage bila URL-nya sudah ada,
 * atau placeholder dashed-diagonal bila belum.
 */
export function SmartImage({
  src,
  alt,
  label,
  dark = false,
  className = "",
  sizes = "100vw",
  priority = false,
  fit = "cover",
  align = "center",
}: {
  src: string | null;
  alt: string;
  label?: string;
  dark?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /**
   * `cover` memenuhi kotak dan memotong kelebihannya — benar untuk thumbnail.
   * `contain` menampilkan gambar utuh tanpa memotong, dipakai untuk PNG
   * transparan yang tidak boleh terpotong di tepinya.
   */
  fit?: "cover" | "contain";
  /**
   * Di mana gambar menempel saat wadahnya lebih tinggi darinya. `bottom`
   * dipakai untuk foto cutout supaya subjeknya berdiri di dasar wadah, bukan
   * melayang di tengah.
   */
  align?: "center" | "bottom";
}) {
  if (!src) {
    return <Placeholder label={label} dark={dark} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`${fit === "contain" ? "object-contain" : "object-cover"} ${
          align === "bottom" ? "object-bottom" : ""
        }`}
      />
    </div>
  );
}
