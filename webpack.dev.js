const path = require('path')

module.exports = {
  entry: './dist/index.js',
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      querystring: require.resolve('querystring-es3')
    }
  },
  output: {
    filename: 'disco.js',
    path: path.resolve(__dirname, 'dist')
  }
}
