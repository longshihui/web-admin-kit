import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  base: "./",
  mode: "production",
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"] as const,
      fileName: () => "index.js",
    },
    minify: true,
    rollupOptions: {
      external: ["vue", "vue-router"],
    },
  },
  plugins: [
    vue(),
    dts({
      rollupTypes: false,
      tsconfigPath: "./tsconfig.build.json",
    }),
  ],
});
