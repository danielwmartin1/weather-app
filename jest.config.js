module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Use Babel to transform JavaScript files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|country-data)/)', // Allow Jest to process `axios` and `country-data` libraries
  ],
  moduleFileExtensions: ['js', 'jsx'], // Ensure Jest resolves JS and JSX files
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
    '\\.svg$': '<rootDir>/src/__mocks__/svgMock.js', // Mock SVG imports
  },
  testEnvironment: 'jsdom', // Use jsdom for testing React components
};