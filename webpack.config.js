const path = require('path')
const { mergeDeep } = require('immutable')

const nodeExternals = require('webpack-node-externals')

const basicConfig = {
  entry: './src/index.ts',
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      querystring: require.resolve('querystring-es3')
    },
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  output: {
    filename: 'disco.js',
    libraryTarget: 'umd',
  }
}

const webConfig = mergeDeep(
  basicConfig,
  {
    target: 'web',
    output: {
      path: path.resolve(__dirname, 'dist/browser')
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.web.json')
          },
          exclude: [
            /node_modules/,
            path.resolve(__dirname, 'src/tfjs/tfjs_node.ts')
          ]
        }
      ]
    },
    resolve: {
      alias: {
        tfjs$: path.resolve(__dirname, 'src/tfjs/tfjs_web.ts')
      }
    }
  }
)

const nodeConfig = mergeDeep(
  basicConfig,
  {
    target: 'node',
    output: {
      path: path.resolve(__dirname, 'dist/node')
    },
    externalsPresets: { node: true },
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder, to be used as a backend library
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.node.json'
          },
          exclude: [
            /node_modules/
          ]
        }
      ]
    },
    resolve: {
      alias: {
        tfjs: path.resolve(__dirname, 'src/tfjs/tfjs_node.ts')
      }
    }
  }
)

module.exports = [
  mergeDeep(
    {
      name: 'web-dev',
      mode: 'development'
    },
    webConfig
  ),
  mergeDeep(
    {
      name: 'web-prod',
      mode: 'production'
    },
    webConfig
  ),
  mergeDeep(
    {
      name: 'node-dev',
      mode: 'development'
    },
    nodeConfig
  ),
  mergeDeep(
    {
      name: 'node-prod',
      mode: 'production'
    },
    nodeConfig
  )
]
