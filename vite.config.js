/* eslint-disable no-undef */
import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "index.ts"),
      name: "babylon-html-label",
      formats: ["es"],
      fileName: (format) => `babylon-html-label.${format}.js`,
    },
    rollupOptions: {
      external: ["@babylonjs/core"],
    },
  },
});
