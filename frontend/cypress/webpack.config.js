module.exports = {
  resolve: {
    fallback: {
      process: require.resolve('process/browser'),
      zlib: require.resolve('browserify-zlib'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
      buffer: require.resolve('buffer/'),
      asset: require.resolve('assert/')
    }
  }
}; 