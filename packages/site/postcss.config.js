module.exports = {
  plugins: [
    'tailwindcss',
    [
      'postcss-preset-env',
      {
        state: 2,
        features: {
          'nesting-rules': true,
        },
      },
    ],
  ],
}
