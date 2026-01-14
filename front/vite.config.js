import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173,
		host: true,
		open: true, // Автоматически открывает браузер
		watch: {
			usePolling: true, // Для Windows может помочь
		},
		hmr: {
			overlay: true, // Показывает ошибки прямо в браузере
		},
	},
})
