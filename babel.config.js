module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Removed react-native-reanimated plugin since we're not using it
    // plugins: ['react-native-reanimated/plugin'],
  };
};

