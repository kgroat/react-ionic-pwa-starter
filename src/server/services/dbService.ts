
import { MongoClient, Server } from 'mongodb'

import { singletonPromise } from './singletonPromise'

const MONGO_URL = process.env.MONGO_URL || `mongodb://localhost:27017/${require('../../../package.json').name}`

export const getDb = singletonPromise(async () => {
  const client = await MongoClient.connect(MONGO_URL)
  const db = client.db()
  await db.createCollection('users')
  console.info(`connected to database ${db.databaseName}`)
  return db
})
