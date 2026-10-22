import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "127.0.0.1",
    port: 5173,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  build: {
    // Icon PNGs stay separate files (fetched when an <img> renders, so page-specific icons load with their page) instead of base64 in the JS.
    assetsInlineLimit: (file: string) => (file.replaceAll("\\", "/").includes("/assets/icons/") ? false : undefined),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
