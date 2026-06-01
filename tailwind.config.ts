import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-eb-garamond)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      aspectRatio: {
        '2/3': '2 / 3',
        '4/3': '4 / 3',
      },
    },
  },
  plugins: [],
}

export default config
