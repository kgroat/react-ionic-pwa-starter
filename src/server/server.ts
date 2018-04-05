
import * as express from 'express'
import * as path from 'path'

import { BaseError } from './errors'
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

app.use(((err: Error, req, res, next) => {
  const status = (err as any).status || 500
  if (__DEV__) {
    console.error(status, err)
  }

  if (!(err instanceof BaseError)) {
    console.warn('An unexpected error occurred', err.message, err.stack)
  }

  if (res.headersSent) {
    return next(err)
  }

  return res.status(status).send(err && err.message || 'Something went wrong')
}) as express.ErrorRequestHandler)

export default app
