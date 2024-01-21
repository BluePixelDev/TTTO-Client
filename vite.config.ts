import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  base: '/TTTO-Client',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        game: '/game.html',
        index: '/index.html',
      },
    },
  },
  server: {
    port: 3002,
  },
});