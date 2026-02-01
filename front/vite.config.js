import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react()],
	server: {
		port: 5000,
		host: '0.0.0.0',
		allowedHosts: true,
		watch: {
			usePolling: true,
		},
		hmr: {
			overlay: true,
		},
		proxy: {
			'/api': {
				target: 'http://backend:8000',
				changeOrigin: true,
			},
		},
	},
})
