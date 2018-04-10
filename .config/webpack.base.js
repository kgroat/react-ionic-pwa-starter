
const path = require('path')

const srcDir = path.join(__dirname, '../src')
const appDir = path.join(srcDir, 'app')
const serverDir = path.join(srcDir, 'server')



const NODE_ENV = process.env.NODE_ENV || 'development'
const __DEV__ = NODE_ENV !== 'production'
const BASE_URL = (() => {
  let uncleanBase = process.env.BASE_URL || '/'
  if (!/^\//.test(uncleanBase)) {
    uncleanBase = `/${uncleanBase}`
  }
  if (!/\/$/.test(uncleanBase)) {
    uncleanBase = `${uncleanBase}/`
  }
  return uncleanBase
})()


const base = {
  devtool: __DEV__ ? 'eval-source-map' : 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.scss'],
    alias: {
      components: path.join(appDir, 'components'),
      containers: path.join(appDir, 'containers'),
      'redux-store': path.join(appDir, 'redux-store'),
      actions: path.join(appDir, 'redux-store/actions'),
      thunks: path.join(appDir, 'redux-store/thunks'),
      state: path.join(appDir, 'state'),
      appConfig: path.join(appDir, 'appConfig'),

      api: path.join(serverDir, 'api'),
      services: path.join(serverDir, 'services'),
      push: path.join(serverDir, 'push'),

      app: appDir,
      models: path.join(srcDir, 'models'),
      server: serverDir,
      serviceWorker: path.join(srcDir, 'serviceWorker'),
      shared: path.join(srcDir, 'shared'),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: path.join(__dirname, './tsconfig.json'),
            }
          },
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|ico)$/,
        loaders: [
          {
            loader: 'file-loader'
          }
        ]
      },
    ]
  },
}

module.exports = {
  NODE_ENV,
  __DEV__,
  base,
  BASE_URL,
}
