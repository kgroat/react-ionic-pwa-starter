
const webpack = require('webpack')
const path = require('path')

const { dependencies } = require('../package.json')

const {
  base,
  NODE_ENV,
  __DEV__,
} = require('./webpack.base')

const srcDir = path.join(__dirname, '../src/server')
const distDir = path.join(__dirname, '../server')
const templatesDir = path.join(srcDir, 'templates')

const main = process.env.SERVERLESS
           ? path.join(srcDir, 'server.ts')
           : path.join(srcDir, 'index.ts')

const index = __DEV__
            ? [
                main,
                'webpack/hot/only-dev-server',
              ]
            : main

const ignore = (pkg) => {
  const rgx = new RegExp(`^${pkg}(/.+)?$`, 'i')

  return (ctx, req, cb) => {
    if (rgx.test(req)){
      return cb(null, 'commonjs ' + req);
    } else {
      cb()
    }
  }
}

module.exports = Object.assign({}, base, {
  entry: {
    index,
  },
  output: {
    filename: '[name].js',
    path: distDir,
    libraryTarget: process.env.SERVERLESS ? 'commonjs' : undefined,
  },
  externals: Object.keys(dependencies).map(ignore),
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false,
  },
  module: Object.assign({}, base.module, {
    rules: base.module.rules.concat([
      {
        test: /\.s?css$/,
        use: [
          {
            loader: "css-loader",
            options: {
              importLoaders: 3,
            }
          },
          {
            loader: 'resolve-url-loader',
          },
          {
            loader: "sass-loader",
          }
        ]
      },
      {
        test: /\.ejs$/,
        use: [
          {
            loader: 'ejs-loader',
          }
        ]
      }
    ]),
  }),
  plugins: [
    new webpack.DefinePlugin({
      '__DEV__': JSON.stringify(__DEV__)
    }),
  ]
})
