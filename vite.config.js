import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // Proxy ConfirmTkt API requests to bypass CORS on localhost
            '/api/confirmtkt': {
                target: 'https://www.confirmtkt.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/confirmtkt/, '/api/pnr/status'),
                secure: true
            }
        }
    }
})
