/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                wc: {
                    blue: '#003f7f',
                    red: '#e30613',
                    gold: '#f5a623',
                    silver: '#a8a9ad',
                    dark: '#0a0e1a',
                    card: '#111827',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
