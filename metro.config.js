const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    alias: {
      crypto: 'react-native-crypto',
      stream: 'readable-stream',
      buffer: '@craftzdog/react-native-buffer',
      events: 'events',
      util: 'util',
      path: 'path-browserify',
      os: 'os-browserify',
    },
    platforms: ['ios', 'android', 'native', 'web'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  watchFolders: [],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
