
import * as express from 'express'

import pushRouter from './push'
import userRouter from './user'

const apiRouter = express.Router()

apiRouter.use((req, res, next) => {
  if (req.method.toUpperCase() === 'OPTIONS') {
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE')
  }

  next()
})

apiRouter.use(express.json())

apiRouter.use('/push', pushRouter)
apiRouter.use('/user', userRouter)

export default apiRouter
