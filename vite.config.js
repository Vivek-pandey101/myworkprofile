import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Multi-page build: the portfolio (index.html) and the standalone skill
// command reference (reference.html) are separate pages/URLs with separate
// bundles, so the heavy reference content never weighs down the main page.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/myworkprofile/',
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        reference: fileURLToPath(new URL('./reference.html', import.meta.url)),
      },
    },
  },
})
