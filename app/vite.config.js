import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// TeachEase como PWA: se instala desde el navegador en Android, iPhone y computador,
// y funciona sin conexión (todo el contenido de práctica viaja con la app).
export default defineConfig({
  // Rutas relativas: la app funciona en la raíz del dominio o dentro de una subcarpeta
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png', 'icons/favicon-32.png', 'marca/*.svg'],
      manifest: {
        id: '/',
        name: 'TeachEase',
        short_name: 'TeachEase',
        description: 'Tu apoyo silencioso en el aula. Aprende y fortalece una segunda lengua para enseñar con confianza.',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#0C1A5E',
        background_color: '#F3F5FB',
        categories: ['education', 'productivity'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Modo Aula', short_name: 'Aula', url: '/#/aula', icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }] },
          { name: 'Preparar mi clase', short_name: 'Preparar', url: '/#/preparar', icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }] },
          { name: 'Practicar', short_name: 'Practicar', url: '/#/practicar', icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
});
