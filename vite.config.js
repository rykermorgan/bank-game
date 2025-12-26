import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [],
      manifest: {
        name: 'Bank Dice Game',
        short_name: 'Bank',
        description: 'Mobile companion app for the Bank dice game - track scores, manage rounds, and keep the game moving fast!',
        theme_color: '#6366F1',
        background_color: '#F5F5F5',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        // TODO: Add app icons before production deployment
        // icons: [
        //   { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        //   { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        // ]
      },
      workbox: {
        // Cache all static assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
        // Runtime caching for better offline experience
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true, // Enable PWA in development for testing
        type: 'module'
      }
    })
  ],
  server: {
    host: true, // Allow access from network (for mobile testing)
    port: 5173
  }
})
