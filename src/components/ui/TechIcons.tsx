import * as simpleIcons from "simple-icons";
import { Chip } from "./Primitives";

export type SimpleIcon = { title: string; hex: string; path: string };

/**
 * Label teknologi yang kita tulis → slug simple-icons.
 * Hanya label yang benar-benar punya ikon brand yang dipetakan; sisanya
 * sengaja jatuh ke chip teks, karena ikon generik tidak memberi informasi apa pun.
 */
const ICON_BY_LABEL: Record<string, string> = {
  flutter: "Flutter",
  dart: "Dart",
  laravel: "Laravel",
  php: "Php",
  supabase: "Supabase",
  postgresql: "Postgresql",
  mysql: "Mysql",
  fastapi: "Fastapi",
  docker: "Docker",
  nginx: "Nginx",
  pytorch: "Pytorch",
  onnx: "Onnx",
  opencv: "Opencv",
  gemini: "Googlegemini",
  firebase: "Firebase",
  deno: "Deno",
  ollama: "Ollama",
  "alpine.js": "Alpinedotjs",
  alpinejs: "Alpinedotjs",
  gsap: "Gsap",
  swiper: "Swiper",
  golang: "Go",
  go: "Go",
  git: "Git",
  github: "Github",
  linux: "Linux",
  python: "Python",
  tensorflow: "Tensorflow",
  "tensorflow / keras": "Tensorflow",
  keras: "Keras",
  "scikit-learn": "Scikitlearn",
  pandas: "Pandas",
  numpy: "Numpy",
  jupyter: "Jupyter",
  figma: "Figma",
  vercel: "Vercel",
  vite: "Vite",
  tailwind: "Tailwindcss",
  "tailwind css": "Tailwindcss",
  react: "React",
  "next.js": "Nextdotjs",
  nextjs: "Nextdotjs",
  typescript: "Typescript",
  javascript: "Javascript",
  html5: "Html5",
  css: "Css",
  "android studio": "Androidstudio",
  "framer motion": "Framer",
  cursor: "Cursor",
  copilot: "Githubcopilot",
  "github copilot": "Githubcopilot",
  "claude code": "Claude",
  claude: "Claude",
};

/** Ikon brand untuk satu label teknologi, atau null kalau memang tidak punya. */
export function techIcon(label: string): SimpleIcon | null {
  const key = ICON_BY_LABEL[label.trim().toLowerCase()];
  if (!key) return null;
  const icon = (simpleIcons as unknown as Record<string, SimpleIcon>)[`si${key}`];
  return icon && icon.path ? icon : null;
}


/** Luminансi relatif WCAG dari hex simple-icons (tanpa '#'). */
function luminance(hex: string): number {
  const n = parseInt(hex, 16);
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/**
 * Sebagian lambang brand nyaris tak berwarna — Vercel, Cursor, Copilot dan
 * GitHub hitam pekat; Pandas dan NumPy hampir hitam. Di tema gelap semuanya
 * lenyap ke dalam latar. Untuk yang seperti itu warnanya diambil dari
 * `currentColor`, jadi ikut warna teks di sekitarnya dan tetap terlihat di
 * kedua tema — di tema terang hasilnya sama saja seperti sebelumnya.
 */
function isAchromatic(hex: string): boolean {
  const l = luminance(hex);
  return l < 0.05 || l > 0.85;
}

/** SVG brand saja — dekoratif; nama teknologinya disediakan oleh pemanggil. */
export function TechGlyph({ icon, size = 18 }: { icon: SimpleIcon; size?: number }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={{ fill: isAchromatic(icon.hex) ? "currentColor" : `#${icon.hex}` }}
      className="shrink-0"
    >
      <path d={icon.path} />
    </svg>
  );
}

/**
 * Deretan teknologi sebuah proyek, sebagai chip teks — bukan logo. Yang membaca
 * kartu proyek sering HR yang mencocokkan kata kunci lowongan; logo Supabase
 * atau Vercel tidak terbaca oleh mereka. Logo tetap dipakai di Skills.
 */
export function TechIcons({ items, className = "" }: { items: string[]; className?: string }) {
  if (items.length === 0) return null;

  return (
    <ul className={`m-0 flex list-none flex-wrap items-center gap-2 p-0 ${className}`}>
      {items.map((label) => (
        <li key={label}>
          <Chip>{label}</Chip>
        </li>
      ))}
    </ul>
  );
}
