import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './providers/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        maga: {
          green: '#006B3F',
          greenDark: '#004D2D',
          gold: '#D4A72C',
          cream: '#F5F7F3',
        },
      },
    },
  },
  plugins: [],
};
export default config;
