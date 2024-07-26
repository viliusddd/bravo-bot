import 'dotenv/config'
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
import BotClient from './utils/bot'

export default function createApp(db: Kysely<DB>) {
  const app = express()

  const bot = new BotClient(
    process.env.DISCORD_CHANNEL_ID,
    process.env.DISCORD_GUILD_ID,
    process.env.DISCORD_TOKEN
  )

  app.use(express.json())

  app.use('/emojis', emojis(db))
  app.use('/messages', messages(db, bot))
  app.use('/praises', praises(db))
  app.use('/sprints', sprints(db))
  app.use('/templates', templates(db))
  app.use('/users', users(db))

  app.use(jsonErrorHandler)

  return app
}
