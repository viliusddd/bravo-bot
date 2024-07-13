import express from 'express'
import {type Kysely} from 'kysely'
import {type DB} from './database'
import jsonErrorHandler from '@/middleware/jsonErrors'
import messages from '@/modules/messages/controller'
import praises from '@/modules/praises/controller'
import templates from '@/modules/templates/controller'
import emojis from '@/modules/emojis/controller'
import sprints from '@/modules/sprints/controller'
import users from '@/modules/users/controller'

export default function createApp(db: Kysely<DB>) {
  const app = express()

  app.use(express.json())

  app.use('/emojis', emojis(db))
  app.use('/messages', messages(db))
  app.use('/praises', praises(db))
  app.use('/sprints', sprints(db))
  app.use('/templates', templates(db))
  app.use('/users', users(db))

  app.use(jsonErrorHandler)

  return app
}
