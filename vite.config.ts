import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  base: 'TTTO-CLient',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        app: '/src/pages/index.js',
      },
    },
  },
  server: {
    port: 3002,
    open: '/src/pages/index.html',
  },
});