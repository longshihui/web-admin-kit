import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const shouldBuildSourcemap = process.env.COLORLESS_BUILD_SOURCEMAP !== "false";

export default defineConfig({
  build: {
    target: "esnext",
    sourcemap: shouldBuildSourcemap,
    emptyOutDir: true,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: ["vue", "vue-router"],
    },
  },
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.build.json",
      compilerOptions: shouldBuildSourcemap
        ? undefined
        : {
            declarationMap: false,
            sourceMap: false,
          },
    }),
  ],
});
