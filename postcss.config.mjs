const config = {
  plugins: {
    '@tailwindcss/postcss': {
      content: [
        './index.html',
        './src/**/*.{ts,tsx,js,jsx}',
      ],
    },
  },
}

export default config
