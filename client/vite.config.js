import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { API_URL } from "./contants";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5176,
    proxy: {
      "/api": {
        target: API_URL,
        secure: false,
      },
    },
  },

  plugins: [react()],
});
