module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(@google-cloud|uuid|gaxios|gcp-metadata|google-auth-library)/)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
};
