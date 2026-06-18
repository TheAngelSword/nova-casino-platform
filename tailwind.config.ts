import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        nova: {
          bg: '#07070F',
          bg2: '#0B0B18',
          surface: '#101020',
          surface2: '#16162A',
          line: 'rgba(255,255,255,0.10)',
          text: '#EAEBF5',
          text2: '#A7ADC4',
          violet: '#9B6CF6',
          blue: '#4F8DFF',
          cyan: '#2DD4DE',
          gold: '#F4C657',
          green: '#46D399',
          orange: '#FB923C',
          red: '#F2607A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Chakra Petch', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        glow: '0 18px 60px rgba(123, 97, 246, .22)'
      }
    }
  },
  plugins: []
};
export default config;
