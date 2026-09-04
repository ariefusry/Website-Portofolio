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
          background: "#f2f4f6",
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
            background: "#f4ddd0",
            color: "#7a4522",
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
            color: "#14171a",
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
            color: "#4a545f",
          }}
        >
          <span style={{ fontWeight: 600, color: "#14171a" }}>Arief M. Usry</span>
          <span>Flutter · Laravel · Supabase · TensorFlow</span>
        </div>
      </div>
    ),
    size,
  );
}
