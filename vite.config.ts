import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    
    proxy: {
      '/clientes': 'http://localhost:3000',
      '/carros': 'http://localhost:3000',
      '/servicos': 'http://localhost:3000',
      '/dashboard': 'http://localhost:3000',
      // add additional backend endpoints here as necessary
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
