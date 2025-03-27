module.exports = {
  presets: [
    '@babel/preset-env', // Transpile modern JavaScript
    '@babel/preset-react', // Transpile React JSX
  ],
  plugins: [
    '@babel/plugin-transform-runtime', // Add support for runtime transformations
  ],
};