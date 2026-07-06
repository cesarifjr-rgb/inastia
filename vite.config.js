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
        conciergerieAirbnbPortoVecchio: resolve(__dirname, 'conciergerie-airbnb-porto-vecchio.html'),
        conciergerieSolenzara: resolve(__dirname, 'conciergerie-location-saisonniere-solenzara.html'),
        conciergerieZonzaPinarello: resolve(__dirname, 'conciergerie-airbnb-zonza-pinarello.html'),
        conciergerieLecciSaintCyprien: resolve(__dirname, 'conciergerie-airbnb-lecci-saint-cyprien.html'),
        conciergerieGhisonaccia: resolve(__dirname, 'conciergerie-ghisonaccia.html'),
        gestionAirbnbCorseDuSud: resolve(__dirname, 'gestion-airbnb-corse-du-sud.html'),
        menageAirbnbCorseDuSud: resolve(__dirname, 'menage-airbnb-corse-du-sud.html'),
        packLancementAirbnb: resolve(__dirname, 'pack-lancement-airbnb.html'),
        auditGratuitPotentielLocatif: resolve(__dirname, 'audit-gratuit-potentiel-locatif.html'),
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


