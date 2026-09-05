import type { Metadata } from "next";
import { Instrument_Sans, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ariefusry.vercel.app";
const description =
  "Fullstack engineer (Flutter, Laravel, Supabase) with a second track in data and machine learning. Paid client platforms shipped, an internship at PT Pos Indonesia, and a paper accepted at IC2IE 2026.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arief M. Usry — Fullstack Engineer",
    template: "%s — Arief M. Usry",
  },
  description,
  keywords: [
    "Arief Muhammad Usry",
    "fullstack engineer",
    "Flutter",
    "Laravel",
    "Supabase",
    "machine learning",
    "Telkom University",
  ],
  authors: [{ name: "Arief Muhammad Usry" }],
  creator: "Arief Muhammad Usry",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Arief M. Usry",
    title: "Arief M. Usry — Fullstack Engineer",
    description,
    locale: "en_US",
    alternateLocale: ["id_ID"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arief M. Usry — Fullstack Engineer",
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: skrip tema di <head> sengaja memasang
    // `data-theme` pada <html> sebelum React hidrasi, jadi atribut server dan
    // klien memang berbeda. Cakupannya hanya elemen ini, bukan isinya.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Tema dipasang sebelum render pertama. Kalau ini dikerjakan React,
          halaman sempat tergambar dengan tema salah lalu berkedip berganti.
          Tanpa pilihan tersimpan, atribut sengaja tidak dipasang sama sekali
          supaya @media (prefers-color-scheme) yang memutuskan.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("portfolio-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
        {/*
          framer-motion me-render initial style (opacity:0) di HTML server.
          Tanpa JS, konten akan tak terlihat — noscript ini mengembalikannya.
        */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body
        className={`${instrumentSans.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
