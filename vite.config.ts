import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Plugin } from 'vite'

// Simple markdown plugin
const markdownPlugin = (): Plugin => ({
  name: 'markdown-loader',
  transform(code, id) {
    if (id.endsWith('.md')) {
      return {
        code: `export default ${JSON.stringify(code)}`,
        map: null
      }
    }
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), markdownPlugin()],
  build: {
    target: 'esnext',
    sourcemap: true
  }
});