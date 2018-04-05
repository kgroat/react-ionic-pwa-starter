
import { MongoClient } from 'mongodb'

import { singletonPromise } from './singletonPromise'

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const DB_NAME = 'react-ionic-pwa-starter'

export const getDb = singletonPromise(async () => {
  const client = await MongoClient.connect(MONGO_URL)
  const db = client.db(DB_NAME)
  await db.createCollection('users')
  console.info(`connected to database ${DB_NAME}`)
  return db
})
