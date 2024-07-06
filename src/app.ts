import express from 'express'
import {type Kysely} from 'kysely'
import {type DB} from './database'
import messages from '@/modules/messages/controller'

/* eslint @typescript-eslint/no-unused-vars: */
export default function createApp(db: Kysely<DB>) {
  const app = express()

  app.use(express.json())

  app.use('/messages', messages)

  return app
}
