// const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#0b6e4f',
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
        default: 'var(--aw-color-text-default)',
        muted: 'var(--aw-color-text-muted)',
      },
      // fontFamily: {
      //   sans: ['var(--aw-font-sans)', ...defaultTheme.fontFamily.sans],
      //   serif: ['var(--aw-font-serif)', ...defaultTheme.fontFamily.serif],
      //   heading: ['var(--aw-font-heading)', ...defaultTheme.fontFamily.sans],
      // },
      boxShadow: {
        'custom-light': 'inset -5px -5px 10px 0px rgb(11, 110, 79), inset 5px 5px 10px 0px rgb(11, 110, 79);',
        'custom-dark': 'inset 5px 5px 10px 0px rgba(0, 0, 0, 0.3)',
        'custom-light-out': '-5px -5px 10px 0px rgb(11, 110, 79), 5px 5px 10px 0px rgba(0, 0, 0, 0.3);',
        'custom-light-out-white': '-5px -5px 10px 0px #fff, 5px 5px 10px 0px rgba(255, 255, 255, 0.3);',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
};
