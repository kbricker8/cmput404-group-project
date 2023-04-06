import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://github.com/kbricker8/cmput404-group-project/",
  plugins: [react()],
})
