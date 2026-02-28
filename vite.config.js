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
    },
    // Security: strip comments from JS output (using esbuild, no extra dep needed)
    minify: 'esbuild',
    target: 'es2020'
  },
  esbuild: {
    legalComments: 'none',
    drop: ['debugger']
  }
})


