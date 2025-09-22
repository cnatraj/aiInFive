import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import autoprefixer from "autoprefixer";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssCodeSplit: false,
  },
});
