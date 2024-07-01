import express from 'express'
import {type DB} from './database'
import {type Kysely} from 'kysely'

export default function createApp(db: Kysely<DB>) {
  const app = express()

  app.get('/messages', (req, res) => {
    res.sendStatus(200)
  })

  return app
}
