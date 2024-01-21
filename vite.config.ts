import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  base: 'TTTO-CLient',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: '/game.html',
        game: '/index.html',
      },
    },
  },
  server: {
    port: 3002,
  },
});