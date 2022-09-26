import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  base: "/vue-smoothie/",

  publicDir: mode === "lib" ? false : "public",

  build: {
    // minify: false,
    // minify: "terser",

    outDir: mode === "lib" ? "dist_lib" : "dist",

    emptyOutDir: !process.env.__OMNI,

    rollupOptions: {
      output: {
        entryFileNames:
          mode === "lib" ? (process.env.__OMNI ? "omniSmoothie.js" : "smoothie.js") : `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },

      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: mode === "lib" ? ["vue", "three"] : undefined,
    },

    lib:
      mode === "lib"
        ? {
            entry: resolve(__dirname, "index.js"),
            name: "Smoothie Components Library",
            formats: ["es"],
          }
        : undefined,
  },

  envPrefix: ["VITE_", "__"],
}));
