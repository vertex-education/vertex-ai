import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { sites } from "./build/sites-vite-plugin";

export default defineConfig({
  server: {
    port: 3000,
  },
  optimizeDeps: {
    exclude: ["@tanstack/react-start", "@tanstack/start-server-core"],
  },
  ssr: {
    optimizeDeps: {
      exclude: ["@tanstack/react-start", "@tanstack/start-server-core"],
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    cloudflare({
      viteEnvironment: { name: "ssr" },
      configPath: "./wrangler.jsonc",
      config: {
        main: "./src/worker.ts",
      },
      remoteBindings: true,
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    sites(),
  ],
});
