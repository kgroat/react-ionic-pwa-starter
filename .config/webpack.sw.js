
const webpack = require('webpack')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

const packageJson = require('../package.json')

const {
  base,
  __DEV__,
  BASE_URL,
} = require('./webpack.base')

const srcDir = path.join(__dirname, '../src/serviceWorker')
const distDir = path.join(__dirname, '../public')

const main = path.join(srcDir, 'index.ts')

module.exports = {
  ...base,
  entry: {
    sw: main,
  },
  output: {
    filename: '[name].js',
    path: distDir,
  },
  plugins: [
    new webpack.DefinePlugin({
      '__DEV__': JSON.stringify(__DEV__),
      'process.env.BASE_URL': JSON.stringify(BASE_URL),
    }),
    new UglifyJsWebpackPlugin({
      uglifyOptions: {
        ecma: 6,
      }
    }),
  ],
}
