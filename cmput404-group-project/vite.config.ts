import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import ssr from 'vite-plugin-ssr/plugin';

export default defineConfig({
  plugins: [reactRefresh(), ssr()],
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'src/main.tsx',
    },
  },
});
