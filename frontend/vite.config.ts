import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["react-countup"],
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@lib": path.resolve(__dirname, "./src/lib"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.LIFEOS_DEV_API_TARGET || "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
    // Only the frontend lives in src/. Ignore the large backend/tooling trees
    // so the dev file-watcher stays well under the OS inotify limit (ENOSPC).
    watch: {
      ignored: [
        "**/backend/**",
        "**/docs/**",
        "**/e2e/**",
        "**/dist/**",
        "**/playwright-report/**",
        "**/test-results/**",
        "**/node_modules/**",
        "**/.git/**",
      ],
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "query-vendor": ["@tanstack/react-query"],
          "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
        },
      },
    },
  },
});
