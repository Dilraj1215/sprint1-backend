import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // In development, proxy /api requests to the local Express backend
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
