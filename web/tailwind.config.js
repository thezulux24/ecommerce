/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#F9F8F6",
                foreground: "#1A1A1A",
                primary: {
                    DEFAULT: "#2D2D2D",
                    foreground: "#FFFFFF",
                },
                accent: {
                    DEFAULT: "#D4B499",
                    foreground: "#1A1A1A",
                },
                muted: {
                    DEFAULT: "#E5E1DA",
                    foreground: "#666666",
                }
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                display: ["Outfit", "sans-serif"],
            },
        },
    },
    plugins: [],
}
