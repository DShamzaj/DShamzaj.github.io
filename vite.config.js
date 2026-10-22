import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Two pages: the main portfolio (index.html) and the Open Source Lab (open-source/index.html).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        openSource: resolve(__dirname, 'open-source/index.html'),
      },
    },
  },
})
