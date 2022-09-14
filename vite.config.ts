import { fileURLToPath, URL } from "node:url";
import svgLoader from "vite-svg-loader";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: "src/main.js",
      output: {
        format: "system",
      },
      preserveEntrySignatures: "strict",
    },
  },
  server: {
    port: 3000,
  },
  base: "http://localhost:3000/",
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          base: "/src",
        },
      },
    }),
    svgLoader(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/assets/scss/fonts.scss";
          @import "./src/assets/scss/globals.scss";
          @import "./src/assets/scss/variables.scss";
        `,
      },
    },
  },
});
