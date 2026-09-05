import { ImageResponse } from "next/og";

/**
 * Favicon. Dibangkitkan seperti opengraph-image supaya warnanya ikut satu
 * sumber palet — Onyx dengan inisial Porcelain.
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
          background: "#1f1d1d",
          color: "#f1ece6",
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
