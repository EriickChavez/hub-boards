import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // 1. Externaliza TODO lo que esté en node_modules
      external: ['react', 'react-dom', 'react-dom/client'],
      output: {
        format: 'iife',
        entryFileNames: 'bundle.js',
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOM'
        },
      },
    },
  },
});