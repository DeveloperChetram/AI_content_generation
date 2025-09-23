import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Remove console logs in production
    {
      name: 'remove-console',
      transform(code, id) {
        if (process.env.NODE_ENV === 'production' || import.meta.env.PROD) {
          // Remove various console statements
          return code
            .replace(/console\.log\([^)]*\);?/g, '')
            .replace(/console\.warn\([^)]*\);?/g, '')
            .replace(/console\.error\([^)]*\);?/g, '')
            .replace(/console\.info\([^)]*\);?/g, '')
            .replace(/console\.debug\([^)]*\);?/g, '')
            .replace(/console\.trace\([^)]*\);?/g, '')
            .replace(/console\.(log|warn|error|info|debug|trace)\s*\([^)]*\)\s*;?/g, '');
        }
        return code;
      }
    }
  ],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: 5173,
    host: true
  }
})
