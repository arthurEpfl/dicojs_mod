const path = require('path')
const { mergeDeep } = require('immutable')

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
    path: path.resolve(__dirname, 'dist')
  }
}

const webConfig = mergeDeep(
  basicConfig,
  {
    target: 'web',
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
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.node.json')
          },
          exclude: [
            /node_modules/,
            path.resolve(__dirname, 'src/tfjs/tfjs_web.ts'),
            path.resolve(__dirname, 'src/msf/data')
          ]
        }
      ]
    },
    resolve: {
      alias: {
        tfjs$: path.resolve(__dirname, 'src/tfjs/tfjs_node.ts')
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
