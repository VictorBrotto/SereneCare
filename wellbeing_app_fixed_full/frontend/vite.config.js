import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // ADICIONE ESTA LINHA
    port: 5173,
    strictPort: true, // ADICIONE ESTA LINHA (opcional)
    hmr: {
      clientPort: 5173 // ADICIONE ESTA SEÇÃO
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})