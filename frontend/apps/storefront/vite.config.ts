import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/main.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/jsonapi': 'http://localhost:8088',
      '/api': 'http://localhost:8088',
      '/session/token': 'http://localhost:8088',
      '/cart': 'http://localhost:8088',
      '/user': 'http://localhost:8088',
      '/sites': 'http://localhost:8088',
    },
  },
  resolve: {
    alias: {
      '@rareimagery/types': path.resolve(__dirname, '../../packages/types/src'),
      '@rareimagery/api': path.resolve(__dirname, '../../packages/api/src'),
      '@rareimagery/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
});
