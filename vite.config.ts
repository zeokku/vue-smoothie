import { defineConfig, LibraryOptions } from "vite";
import vue from "@vitejs/plugin-vue";

import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue({
      reactivityTransform: true,
      template: {
        compilerOptions: {
          hoistStatic: true,
        },
      },
    }),

    // {
    //   // @todo report
    //   // for some reason sfc compiler exports vue macro for reactivity transform
    //   // fixed by referencing in env.d.ts
    //   name: "Fix reactivity transform",
    //   transform(code, id) {
    //     if (/\.vue/.test(id)) {
    //       return code.replace(/\$shallowRef,?/g, "");
    //     }
    //   },
    // },
  ],
  base: "/vue-smoothie/",

  publicDir: mode === "lib" ? false : "public",

  esbuild: {
    drop: ["console"],
  },

  build: {
    minify: false,
    // minify: "terser",
    // terserOptions: {
    //   mangle: true,
    //   compress: {
    //     drop_console: true,
    //   },
    // },

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
        ? ({
            entry: resolve(__dirname, "index.js"),
            name: "Smoothie Components Library",
            formats: ["es"],
          } as LibraryOptions)
        : undefined,
  },

  envPrefix: ["VITE_", "__"],
}));
