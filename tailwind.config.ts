import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rua: {
          beige: '#fdfbf7', // Light creamy background
          sand: '#e8e1d5',  // Darker beige for accents
          red: '#8a2c2c',   // Deep vintage red
          charcoal: '#2c2c2c',
          gold: '#d4af37'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        display: ['Cinzel', 'serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        pulseslide: 'pulseslide 2s cubic-bezier(0.77, 0, 0.175, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseslide: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
