import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Three pages: the main portfolio (index.html) the Community Contributions page (open-source/index.html) and the newsletter (newsletter/index.html).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        openSource: resolve(__dirname, 'open-source/index.html'),
        newsletter: resolve(__dirname, 'newsletter/index.html'),
      },
    },
  },
})
