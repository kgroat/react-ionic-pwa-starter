
const { serverPort } = require('../../package.json')

export const apiBaseUrl = __DEV__ ? `http://localhost:${serverPort}/api` : './api'
