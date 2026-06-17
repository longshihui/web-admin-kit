import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    target: "esnext",
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: ["lodash", "lodash-es", "vue"],
    },
  },
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.build.json",
    }),
  ],
});
