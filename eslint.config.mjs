import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/build/**",
    ],
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      // Keep build-time parity and lightweight best practices
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      eqeqeq: ["error", "smart"],
      curly: ["error", "multi-line"],
      "prefer-const": "error",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Mirror TS build's noUnusedLocals ergonomically
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }
      ],
      // Keep parity with build: disallow explicit any
      "@typescript-eslint/no-explicit-any": "error",
      // Avoid false positives in TS files
      "no-undef": "off",
    },
  },
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }
      ],
      "no-undef": "error",
    },
  },
];

export default eslintConfig;
