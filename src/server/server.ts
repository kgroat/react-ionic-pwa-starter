
import * as express from 'express'
import * as path from 'path'

import apiRouter from './api'

const { serverPort, webpackPort } = require('../../package.json')

const app = express()

if (__DEV__) {
  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', `http://localhost:${webpackPort}`)
    next()
  })
  app.set('port', process.env.PORT || serverPort)
}

const publicDir = path.join(process.cwd(), 'public')

app.use(express.static(publicDir))

app.use('/api', apiRouter)
app.get('*', (req, res) => {
  res.sendFile(`${publicDir}/index.html`)
})

app.use(((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  return res.status(err.status || 500).send(err && err.message || 'Something went wrong')
}) as express.ErrorRequestHandler)

export default app
