import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    port: 3000,
    open: false
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        mentions: resolve(__dirname, 'mentions-legales.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        cgv: resolve(__dirname, 'cgv.html'),
      }
    }
  }
})
