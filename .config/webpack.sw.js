
const webpack = require('webpack')
const path = require('path')

const packageJson = require('../package.json')

const {
  base,
  __DEV__,
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
      '__DEV__': JSON.stringify(__DEV__)
    }),
    // new webpack.optimize.UglifyJsPlugin(),
  ],
}
