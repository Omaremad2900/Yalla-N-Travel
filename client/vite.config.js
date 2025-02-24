import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5176,
    proxy: {
      "/api": {
        target: "http://192.168.49.2:30080",
        secure: false,
      },
    },
  },

  plugins: [react()],
});
