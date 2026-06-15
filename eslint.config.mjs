import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  js.configs.recommended,
  globalIgnores(["build/**", "dist/**", ".output/**", ".vinext/**", ".wrangler/**", "node_modules/**"]),
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
]);

export default eslintConfig;
