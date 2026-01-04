import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Exposes the server to your network automatically
    hmr: {
      overlay: false, // Disables the full-screen error overlay (saves resources)
    },
    watch: {
      usePolling: true, // specific fix for Android file system events or Docker
      interval: 1000,   // Check for changes every 1 second (saves CPU)
    }
  },
  css: {
    devSourcemap: false, // ❌ DISABLES CSS SOURCE MAPS (Huge RAM saver)
  },
  build: {
    sourcemap: false, // ❌ DISABLES JS SOURCE MAPS
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React Dependencies
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          // Firebase Bundle
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'vendor-firebase';
          }
          // UI Libraries (Icons, Animations) - Bundling lucide-react here solves the "huge chunk" issue without refactoring imports
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/lucide-react')) {
            return 'vendor-ui';
          }
          // Text Editor (Heavy dependency for Admin Dashboard)
          if (id.includes('node_modules/@tiptap') || id.includes('node_modules/prosemirror')) {
            return 'feature-editor';
          }
          // Charts (Heavy dependency for Dashboard)
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) {
            return 'feature-charts';
          }
        },
      },
    },
  },
});