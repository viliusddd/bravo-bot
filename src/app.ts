import express from 'express'
import {type Kysely} from 'kysely'
import {type DB} from './database'

/* eslint @typescript-eslint/no-unused-vars: */
export default function createApp(db: Kysely<DB>) {
  const app = express()

  app.get('/messages', (req, res) => {
    res.sendStatus(200)
  })

  return app
}
