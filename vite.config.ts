import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Giúp chạy mượt mà trên GitHub Pages ở mọi đường dẫn con
  server: {
    port: 5173,
    host: true
  }
});
