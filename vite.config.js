import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (id.includes("react-dom") || id.includes("react-router")) {
            return "react-core";
          }

          if (id.includes("recharts") || id.includes("chart.js") || id.includes("react-chartjs-2")) {
            return "charts";
          }

          if (id.includes("axios") || id.includes("socket.io-client")) {
            return "network";
          }
        },
      },
    },
  },
});
