import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const popupHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-google': ['@react-oauth/google'],
        },
      },
    },
  },
  server: {
    headers: popupHeaders,
  },
  preview: {
    headers: popupHeaders,
  },
})
