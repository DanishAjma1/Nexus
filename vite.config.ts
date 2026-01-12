import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'TrustBridge AI',
        short_name: 'TrustBridge',
        description: 'Business Collaboration App',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/login',
        icons: [
          {
            src: '/logo-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        navigateFallbackDenylist: [
          /^\/$/,                               // landing
          /^\/All-Campaigns(\/.*)?$/,
          /^\/Fundraises(\/.*)?$/,
        ],

        runtimeCaching: [
          {
            urlPattern: ({ request, url }) => {
              if (request.destination !== 'document') return false

              const excluded = [
                '/',
                '/All-Campaigns',
                '/Fundraises'
              ]

              return !excluded.some(route =>
                url.pathname === route || url.pathname.startsWith(route + '/')
              )
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pwa-pages-cache'
            }
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' ||
              request.destination === 'style',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache'
            }
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react']
  }
})
