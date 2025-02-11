import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5176,
    proxy: {
      "/api": {
        target: "http://api.yalla.local/api",
        secure: false,
      },
    },
  },

  plugins: [react()],
});
