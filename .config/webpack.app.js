
const webpack = require('webpack')
const path = require('path')

const packageJson = require('../package.json')

const {
  base,
  NODE_ENV,
  __DEV__,
  BASE_URL,
} = require('./webpack.base')

const PORT = process.env.PORT || packageJson.webpackPort
const srcDir = path.join(__dirname, '../src/app')
const distDir = path.join(__dirname, '../public')
const staticDir = path.join(__dirname, '../src/static')
const ionicDistDir = path.join(__dirname, '../node_modules/@ionic/core/dist')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const StringReplacePlugin = require('string-replace-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: __DEV__
})

const main = path.join(srcDir, 'index.tsx')

const index = __DEV__
            ? [
                'react-hot-loader/patch',
                main,
                'webpack/hot/only-dev-server',
              ]
            : main

module.exports = {
  ...base,
  entry: {
    index,
  },
  output: {
    filename: '[name].js',
    path: distDir,
  },
  devServer: {
    contentBase: [
      distDir,
      staticDir,
      ionicDistDir,
    ],
    port: PORT,
    hot: true,
    historyApiFallback: true,
  },
  module: {
    ...base.module,
    rules: [
      ...base.module.rules,
      {
        test: /\.s?css$/,
        use: extractSass.extract({
          use: [
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                modules: true,
                importLoaders: 3,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              }
            },
            {
              loader: 'resolve-url-loader',
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              }
            }
          ],
          // use style-loader in development
          fallback: "style-loader"
        })
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      package: packageJson,
      baseUrl: BASE_URL,
      chunks: ['index'],
      template: path.join(srcDir, 'index.ejs')
    }),
    new CopyWebpackPlugin([
      {
        from: staticDir,
        to: '.',
        toType: 'dir',
      },
      {
        from: ionicDistDir,
        to: '.',
        toType: 'dir',
      },
    ]),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      '__DEV__': JSON.stringify(__DEV__),
      'process.env.BASE_URL': JSON.stringify(BASE_URL),
    }),
    extractSass,
    new UglifyJsWebpackPlugin({
      uglifyOptions: {
        ecma: 6,
      }
    }),
  ],
}
