const rootDir = __dirname + '/../../';

module.exports = {
    plugins: [
        require('postcss-import')({
            path: [rootDir]
        }),
        require('tailwindcss/nesting'),
        require('tailwindcss')(rootDir + './tailwind.config.js'),
        require('autoprefixer'),
    ],
}
