import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all requests starting with /api to your backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // Optional: rewrite path if your backend API expects a different path
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
