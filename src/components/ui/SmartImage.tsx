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
}: {
  src: string | null;
  alt: string;
  label?: string;
  dark?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
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
        className="object-cover"
      />
    </div>
  );
}
