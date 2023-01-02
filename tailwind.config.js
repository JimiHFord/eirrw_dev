module.exports = {
  presets: [
    require('./themes/congo/tailwind.config.js')
  ],
  content: [
    "./layouts/**/*.html",
    "./content/**/*.{html,md}",
    "./themes/congo/layouts/**/*.html",
    "./themes/congo/content/**/*.{html,md}",
  ],
  plugins: [
    require('@tailwindcss/forms')
  ],
}
