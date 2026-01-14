/** @type {import('tailwindcss').Config} */
export default {
        content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
        theme: {
                extend: {
                        colors: {
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
                        animation: {
                                first: 'moveVertical 30s ease infinite',
                                second: 'moveInCircle 20s reverse infinite',
                                third: 'moveInCircle 40s linear infinite',
                                fourth: 'moveHorizontal 40s ease infinite',
                                fifth: 'moveInCircle 20s ease infinite',
                        },
                        keyframes: {
                                moveHorizontal: {
                                        '0%': { transform: 'translateX(-50%) translateY(-10%)' },
                                        '50%': { transform: 'translateX(50%) translateY(10%)' },
                                        '100%': { transform: 'translateX(-50%) translateY(-10%)' },
                                },
                                moveInCircle: {
                                        '0%': { transform: 'rotate(0deg)' },
                                        '50%': { transform: 'rotate(180deg)' },
                                        '100%': { transform: 'rotate(360deg)' },
                                },
                                moveVertical: {
                                        '0%': { transform: 'translateY(-50%)' },
                                        '50%': { transform: 'translateY(50%)' },
                                        '100%': { transform: 'translateY(-50%)' },
                                },
                        },
                },
        },
        plugins: [],
}
