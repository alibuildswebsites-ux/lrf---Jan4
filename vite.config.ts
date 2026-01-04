import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase the warning limit to 1000KB (1MB) to reduce noise
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
          // UI Libraries (Icons, Animations)
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