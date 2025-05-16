import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const VITE_API_URL = "http://backend:8000/";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: `${VITE_API_URL}`,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
