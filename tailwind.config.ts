import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

// Semantic tokens (page/surface/ink/mute/line/accent) are CSS variables so dark mode
// swaps them in one place — components never need per-element `dark:` classes.
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { 50: '#FFFDF9', 100: '#FAF7F2', 200: '#F3EDE3' },
        sand: { 100: '#EFE6D6', 200: '#E8DCC8', 300: '#D9C9A8' },
        gold: { 300: '#E0C98A', 400: '#D4B978', 500: '#C9A961', 600: '#B08F4A', 700: '#8E7239', 800: '#755C2B' },
        rosegold: { 400: '#C9909A', 500: '#B76E79', 600: '#9C5A64' },
        charcoal: { 700: '#3B342E', 800: '#2A2420', 900: '#1C1815' },
        emerald_ar: '#1F5F4E',
        wa: '#128C4A',
        page: v('page'),
        surface: v('surface'),
        deep: v('deep'),
        ink: v('ink'),
        mute: v('mute'),
        line: v('line'),
        accent: v('accent'),
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      boxShadow: {
        gold: '0 8px 30px rgba(201,169,97,0.12)',
        goldlg: '0 18px 50px rgba(201,169,97,0.28)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0) translateX(0)', opacity: '.25' }, '50%': { transform: 'translateY(-26px) translateX(8px)', opacity: '.9' } },
        ring: { '0%': { transform: 'scale(1)', opacity: '.55' }, '100%': { transform: 'scale(1.7)', opacity: '0' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        ring: 'ring 2.4s ease-out infinite',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [animate],
};
export default config;
