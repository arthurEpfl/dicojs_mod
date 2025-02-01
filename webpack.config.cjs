// const path = require('path')
// const { mergeDeep } = require('immutable')

// const nodeExternals = require('webpack-node-externals')

// const basicConfig = {
//   entry: './src/index.ts',
//   devtool: 'source-map',
//   resolve: {
//     extensions: ['.ts', '.js'],
//     fallback: {
//       crypto: require.resolve('crypto-browserify'),
//       path: require.resolve('path-browserify'),
//       stream: require.resolve('stream-browserify'),
//       querystring: require.resolve('querystring-es3')
//     },
//     alias: {
//       '@': path.resolve(__dirname, 'src')
//     }
//   },
//   output: {
//     filename: 'disco.js',
//     libraryTarget: 'umd',
//   }
// }

// const webConfig = mergeDeep(
//   basicConfig,
//   {
//     target: 'web',
//     output: {
//       path: path.resolve(__dirname, 'dist/browser')
//     },
//     module: {
//       rules: [
//         {
//           test: /\.ts$/,
//           loader: 'ts-loader',
//           options: {
//             configFile: path.resolve(__dirname, 'tsconfig.web.json')
//           },
//           exclude: [
//             /node_modules/,
//             path.resolve(__dirname, 'src/tfjs/tfjs_node.ts')
//           ]
//         }
//       ]
//     },
//     resolve: {
//       alias: {
//         tfjs$: path.resolve(__dirname, 'src/tfjs/tfjs_web.ts')
//       }
//     }
//   }
// )

// const nodeConfig = mergeDeep(
//   basicConfig,
//   {
//     target: 'node',
//     output: {
//       path: path.resolve(__dirname, 'dist/node')
//     },
//     externalsPresets: { node: true },
//     externals: [nodeExternals()], // in order to ignore all modules in node_modules folder, to be used as a backend library
//     module: {
//       rules: [
//         {
//           test: /\.ts$/,
//           loader: 'ts-loader',
//           options: {
//             configFile: 'tsconfig.node.json'
//           },
//           exclude: [
//             /node_modules/
//           ]
//         }
//       ]
//     },
//     resolve: {
//       alias: {
//         tfjs: path.resolve(__dirname, 'src/tfjs/tfjs_node.ts')
//       }
//     }
//   }
// )

// module.exports = [
//   mergeDeep(
//     {
//       name: 'web-dev',
//       mode: 'development'
//     },
//     webConfig
//   ),
//   mergeDeep(
//     {
//       name: 'web-prod',
//       mode: 'production'
//     },
//     webConfig
//   ),
//   mergeDeep(
//     {
//       name: 'node-dev',
//       mode: 'development'
//     },
//     nodeConfig
//   ),
//   mergeDeep(
//     {
//       name: 'node-prod',
//       mode: 'production'
//     },
//     nodeConfig
//   )
// ]

const path = require('path');
const { mergeDeep } = require('immutable');
const nodeExternals = require('webpack-node-externals');

const basicConfig = {
  entry: './dist/index.js', // Ensure the entry is a TypeScript file
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js'], // Ensure Webpack resolves both .ts and .js
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      querystring: require.resolve('querystring-es3'),
    },
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    fullySpecified: false,
  },
  output: {
    filename: 'disco.js',
    libraryTarget: 'umd', // Universal module definition
  },
};

const webConfig = mergeDeep(
  basicConfig,
  {
    target: 'web', // Target the browser environment
    output: {
      path: path.resolve(__dirname, 'dist/browser'),
    },
    module: {
      rules: [
        {
          test: /\.ts$/, // Match TypeScript files
          loader: 'ts-loader', // Use ts-loader to compile TypeScript
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.web.json'), // Use the correct tsconfig for the web target
          },
          exclude: [
            /node_modules/, // Exclude node_modules
            path.resolve(__dirname, 'src/tfjs/tfjs_node.ts'), // Exclude Node-specific files
          ],
        },
      ],
    },
    resolve: {
      alias: {
        tfjs$: path.resolve(__dirname, 'src/tfjs/tfjs_web.ts'), // Use browser-specific alias
      },
    },
  }
);

const nodeConfig = mergeDeep(
  basicConfig,
  {
    target: 'node', // Target the Node.js environment
    output: {
      path: path.resolve(__dirname, 'dist/node'),
    },
    externalsPresets: { node: true }, // Treat Node.js built-ins as external
    externals: [nodeExternals()], // Ignore node_modules for backend builds
    module: {
      rules: [
        {
          test: /\.ts$/, // Match TypeScript files
          loader: 'ts-loader', // Use ts-loader to compile TypeScript
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.node.json'), // Use the correct tsconfig for the Node target
          },
          exclude: [/node_modules/], // Exclude node_modules
        },
      ],
    },
    resolve: {
      alias: {
        tfjs: path.resolve(__dirname, 'src/tfjs/tfjs_node.ts'), // Use Node.js-specific alias
      },
    },
  }
);

module.exports = [
  mergeDeep(
    {
      name: 'web-dev',
      mode: 'development', // Development mode for the web target
    },
    webConfig
  ),
  mergeDeep(
    {
      name: 'web-prod',
      mode: 'production', // Production mode for the web target
    },
    webConfig
  ),
  mergeDeep(
    {
      name: 'node-dev',
      mode: 'development', // Development mode for the Node.js target
    },
    nodeConfig
  ),
  mergeDeep(
    {
      name: 'node-prod',
      mode: 'production', // Production mode for the Node.js target
    },
    nodeConfig
  ),
];
