module.exports = {
  mode: 'jit',
  presets: [
    require('./themes/congo/tailwind.config.js')
  ],
  content: [
    "./layouts/**/*.html",
    "./content/**/*.{html,md}",
    "./themes/congo/layouts/**/*.html",
    "./themes/congo/content/**/*.{html,md}",
    "./assets/ts/**/*.ts",
  ],
  plugins: [
    require('@tailwindcss/forms')
  ],
  darkmode: 'class'
}
