import express from 'express'
import {type Kysely} from 'kysely'
import {type DB} from './database'
import jsonErrorHandler from '@/middleware/jsonErrors'
import messages from '@/modules/message/controller'
import praises from '@/modules/praises/controller'

export default function createApp(db: Kysely<DB>) {
  const app = express()

  app.use(express.json())

  app.use('/messages', messages)
  app.use('/praises', praises(db))

  app.use(jsonErrorHandler)

  return app
}
