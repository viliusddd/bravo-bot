import express from 'express'
import {type Kysely} from 'kysely'
import {type DB} from './database'
import messages from '@/modules/message/controller'
import jsonErrorHandler from '@/middleware/jsonErrors'

import sprints from '@/modules/sprints/controller'
import praises from '@/modules/praises/controller'

/* eslint @typescript-eslint/no-unused-vars: */
export default function createApp(db: Kysely<DB>) {
  const app = express()

  app.use(express.json())

  app.use('/messages', messages)
  app.use('/sprints', sprints(db))
  app.use('/praises', praises(db))

  app.use(jsonErrorHandler)

  return app
}
