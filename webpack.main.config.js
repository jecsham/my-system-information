module.exports = {
  entry: './src/main.js',
  optimization: {
    minimize: true
  },
  module: {
    rules: require('./webpack.rules'),
  },
};
