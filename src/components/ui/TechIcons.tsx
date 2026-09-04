import * as simpleIcons from "simple-icons";
import { Chip } from "./Primitives";

type SimpleIcon = { title: string; hex: string; path: string };

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
  "vs code": "Vsc",
};

function lookup(label: string): SimpleIcon | null {
  const key = ICON_BY_LABEL[label.trim().toLowerCase()];
  if (!key) return null;
  const icon = (simpleIcons as unknown as Record<string, SimpleIcon>)[`si${key}`];
  return icon && icon.path ? icon : null;
}

/**
 * Deretan teknologi. Ikon-nya dekoratif (`aria-hidden`) dan nama teknologinya
 * tetap dibacakan lewat teks sr-only, jadi informasi yang sama sampai ke
 * pengguna screen reader — bukan hanya ke yang bisa melihat warnanya.
 */
export function TechIcons({
  items,
  size = 18,
  className = "",
}: {
  items: string[];
  size?: number;
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <ul className={`m-0 flex list-none flex-wrap items-center gap-2.5 p-0 ${className}`}>
      {items.map((label) => {
        const icon = lookup(label);

        if (!icon) {
          return (
            <li key={label}>
              <Chip>{label}</Chip>
            </li>
          );
        }

        return (
          <li key={label} className="flex items-center">
            <svg
              role="img"
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              width={size}
              height={size}
              style={{ fill: `#${icon.hex}` }}
              className="shrink-0"
            >
              <path d={icon.path} />
            </svg>
            <span className="sr-only">{label}</span>
          </li>
        );
      })}
    </ul>
  );
}
