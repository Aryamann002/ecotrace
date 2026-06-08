import type { Config } from 'tailwindcss';

/**
 * Design tokens for EcoTrace — "Organic Biophilic" style, Sustainability/ESG palette.
 * Keep these in sync with the CSS custom properties in src/app/globals.css.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669',
          light: '#10B981',
          dark: '#047857',
        },
        secondary: '#10B981',
        accent: '#0891B2',
        surface: '#ECFDF5',
        ink: '#064E3B',
        warning: '#FBBF24',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
