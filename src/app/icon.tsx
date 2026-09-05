import { ImageResponse } from "next/og";

/**
 * Favicon. Dibangkitkan seperti opengraph-image supaya warnanya ikut satu
 * sumber palet — hitam dengan inisial putih.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          color: "#ffffff",
          fontSize: 20,
          fontWeight: 700,
          borderRadius: 7,
        }}
      >
        A
      </div>
    ),
    size,
  );
}
