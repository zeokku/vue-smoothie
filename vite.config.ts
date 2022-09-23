import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  base: "/vue-smoothie/",

  publicDir: mode === "lib" ? false : "public",

  build: {
    outDir: mode === "lib" ? "dist_lib" : "dist",

    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },

      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: mode === "lib" ? ["vue"] : undefined,
    },

    lib:
      mode === "lib"
        ? {
            entry: resolve(__dirname, "index.js"),
            name: "Smoothie Components Library",
            formats: ["es"],
            // filename: "smoothie.js",
          }
        : undefined,
  },
}));
