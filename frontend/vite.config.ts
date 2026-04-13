import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5297,
    host: true, // Needed for Docker to expose the port properly
    watch: {
      usePolling: true,
    }
  }
})