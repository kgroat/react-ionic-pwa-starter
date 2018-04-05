
const serverless = require('serverless-http')
const server = require('./server')

exports.handler = serverless(server.default)

console.log('handler', exports.handler)