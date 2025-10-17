import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '898px',
      // xl:"1024px"
    },
    container: {
      center: true,
    },
    extend: {
      animation: {
        'gradient-x': 'gradient-x 10s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'custom-gradient':
          'linear-gradient(150deg, #ffffff 0%, #eef5fc 100%)',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #9867F0, #ED4E50)',
        'teal-gradient':
          'linear-gradient(135deg, #417dc0, #3467a5, #22456d)',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(152, 103, 240, 0.5)',
        'teal-glow': '0 0 40px rgba(65, 125, 192, 0.35)',
      },
      colors: {
        primary: {
          50: '#eef5fc',
          100: '#d9e7f8',
          200: '#b9d2f0',
          300: '#8fb4e4',
          400: '#6596d6',
          500: '#417dc0',
          600: '#3467a5',
          700: '#2b5587',
          800: '#22456d',
          900: '#1d395a',
          950: '#152a42',
        },
      },
    },
  },
  plugins: [],
};
export default config;
