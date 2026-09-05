import { ImageResponse } from "next/og";

export const alt = "Arief M. Usry — Fullstack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f1ece6",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "10px 18px",
            borderRadius: 999,
            background: "#e2ddd6",
            color: "#3a3636",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          OPEN TO ROLES — FULLSTACK · DATA · ML
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 68,
            lineHeight: 1.05,
            fontWeight: 600,
            letterSpacing: -2,
            color: "#1f1d1d",
            maxWidth: 950,
          }}
        >
          Fullstack engineer, with a second track in data and machine learning.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            fontSize: 26,
            color: "#524a48",
          }}
        >
          <span style={{ fontWeight: 600, color: "#1f1d1d" }}>Arief M. Usry</span>
          <span>Flutter · Laravel · Supabase · TensorFlow</span>
        </div>
      </div>
    ),
    size,
  );
}
