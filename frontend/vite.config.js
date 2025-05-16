import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// const VITE_API_URL = "http://localhost:8000/";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8000/",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
