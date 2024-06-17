import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  let alias = {};

  if (mode === "development") {
    alias = {
      "babylon-html-label": path.resolve(__dirname, "../index.ts"),
    };
  }

  return {
    resolve: {
      alias: alias,
    },
    plugins: [],
  };
});
