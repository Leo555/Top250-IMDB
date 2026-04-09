import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['static/img/favicon.ico', 'static/img/apple-touch-icon.png'],
      manifest: {
        name: 'IMDB Top250 - 全球最佳电影排行榜',
        short_name: 'IMDB Top250',
        description: '收录全球评分最高的250部经典电影',
        theme_color: '#e50914',
        background_color: '#141414',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/static/img/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/static/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/static/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: 'es2015',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia')) {
              return 'vendor'
            }
          }
          if (id.includes('movies-detail.json')) {
            return 'data-detail'
          }
          if (id.includes('movies-list.json')) {
            return 'data-list'
          }
        },
      },
    },
  },
})
