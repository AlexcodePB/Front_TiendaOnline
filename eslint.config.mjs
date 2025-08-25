import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // No bloquear builds por uso de any en fases iniciales
      "@typescript-eslint/no-explicit-any": "off",
      // Prefer const como warning, no error
      "prefer-const": "warn",
      // Recomendación de Next para <img>, mantener como warning
      "@next/next/no-img-element": "warn",
    },
  },
];

export default eslintConfig;
