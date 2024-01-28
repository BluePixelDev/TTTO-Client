import path from "node:path";
import process from "node:process";
import { defineConfig } from "vite";

export default defineConfig({
  base: '/TTTO-Client',
  root: "src/views",
  publicDir: "public",
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: '/views/index.html',
      },
    },
  },
  server: {
    port: 3002,
    open: "index.html"
  },
  resolve: {
    alias: { "/src": path.resolve(process.cwd(), "src") }
  },
});