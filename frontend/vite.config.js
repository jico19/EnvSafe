import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Use your framework plugin (Vue, Svelte, etc.)
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
