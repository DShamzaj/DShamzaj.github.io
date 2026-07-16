import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes all asset paths relative, so the site works whether it's
// served from https://<user>.github.io/<repo>/ or a custom domain — no edits needed.
export default defineConfig({
  plugins: [react()],
  base: './',
})
