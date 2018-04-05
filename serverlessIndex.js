
const serverless = require('serverless-http')
const server = require('./server')

const BINARY_ENCODINGS = ['gzip', 'deflate']
const BINARY_CONTENT = [/^image\/.+$/]
function isBinaryEncoding (headers) {
  const contentEncoding = headers['content-encoding']

  if (typeof contentEncoding === 'string') {
    return contentEncoding.split(',').some(value =>
      BINARY_ENCODINGS.some(binaryEncoding =>
        value.indexOf(binaryEncoding !== -1)
      )
    )
  }
}

function isBinaryContent (headers) {
  const contentType = (headers['content-type'] || headers['Content-Type'] || '').split(';')[0]
  return BINARY_CONTENT.some(candidate => candidate.test(contentType))
}

exports.handler = serverless(server.default, {
  binary: function (headers) {
    console.log('headers', headers)
    return isBinaryEncoding(headers) || isBinaryContent(headers)
  },
})
