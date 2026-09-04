import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// eslint-config-next 16 sudah mengekspor flat config langsung, jadi
// pembungkus FlatCompat dari @eslint/eslintrc tidak diperlukan lagi.
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // next-env.d.ts digenerate Next.js dan sengaja memakai triple-slash reference.
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
