/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				// Спокойные оттенки для приложения
				primary: {
					50: '#f0fdf4',
					100: '#dcfce7',
					200: '#bbf7d0',
					300: '#86efac',
					400: '#4ade80',
					500: '#22c55e',
					600: '#16a34a',
					700: '#15803d',
					800: '#166534',
					900: '#14532d',
				},
				calm: {
					blue: '#6b9ac4',
					green: '#7cb69d',
					gray: '#9ca3af',
					slate: '#64748b',
				},
			},
			backdropBlur: {
				xs: '2px',
			},
		},
	},
	plugins: [],
}
