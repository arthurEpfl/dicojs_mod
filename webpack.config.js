const path = require('path')

const basicConfig = {
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
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

module.exports = [
  {
    name: 'dev',
    mode: 'development',
    ...basicConfig
  },
  {
    name: 'prod',
    mode: 'production',
    ...basicConfig
  }
]
