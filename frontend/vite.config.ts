import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/rollup-plugin'

export default defineConfig({
  plugins: [
    react(),
    prerender({
      routes: [
        '/', '/about', '/privacy', '/disclaimer', 
        '/contact', '/methodology', '/faq', '/dev', 
        '/demos', '/export', '/aircraftprofiles'
      ],
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        skipThirdPartyRequests: true,
        launchOptions: {
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        }
      }
    })
  ],
  server: {
    port: 5297,
    host: true,
    allowedHosts: ['logbookwrapped.com', 'localhost'],
    watch: {
      usePolling: true,
    }
  }
})