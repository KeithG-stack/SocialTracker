export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    },
  },
}