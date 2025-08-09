import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy backend API calls
      '/api': 'http://localhost:3000'
    },
    // This makes sure React Router works for frontend paths like /Problems
    historyApiFallback: true
  }
})
