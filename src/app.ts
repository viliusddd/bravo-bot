import express from 'express'
import {type Kysely} from 'kysely'
import {type DB} from './database'

/* eslint @typescript-eslint/no-unused-vars: */
export default function createApp(db: Kysely<DB>) {
  const app = express()

  app.use(express.json())

  app.post('/messages', (req, res) => {
    const {username, sprintCode} = req.body
    if (!username || !sprintCode) {
      res.send(400)
    }
    res.send({userId: 0})
  })
  return app
}
