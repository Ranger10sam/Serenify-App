const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable source maps to prevent <anonymous> file errors
config.serializer = {
  ...config.serializer,
  createModuleIdFactory: () => (path) => path,
};

// Improve resolver configuration
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'cjs'],
  platforms: ['ios', 'android', 'native', 'web'],
};

module.exports = config; 