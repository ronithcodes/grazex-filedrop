import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/upload": "http://localhost:8000",
      "/file": "http://localhost:8000",
      "/download": "http://localhost:8000",
      "/files": "http://localhost:8000",
      "/health": "http://localhost:8000"
    }
  }
});
