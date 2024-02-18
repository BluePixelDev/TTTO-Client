import path from "node:path";
import process from "node:process";
import { defineConfig } from "vite";

export default defineConfig({
  base: '/TTTO-Client',
  publicDir: "public",
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: 'src/index.html',
        host: 'src/play/host.html',
        join: 'src/play/join.html',
        game: 'src/play/game.html',
      },
    },
  },
  server: {
    port: 3002,
    open: "%BASE_URL%/index.html"
  },
  resolve: {
    alias: {"/src": path.resolve(process.cwd(), "src")}
  },
});