import {Router, type Request, Response} from 'express'
// import {Send} from 'express-serve-static-core'
import {StatusCodes} from 'http-status-codes'
import type {Database} from '@/database'
import buildRepository from './repository'
import {discordHandler, jsonRoute} from '@/utils/middleware'
import * as schema from './schema'
import {MessageNotFound} from './errors'
import {SprintNotFound} from '../sprints/errors'
import {UserNotFound} from '../users/errors'
import {createRec} from './services'
import BotClient from '@/utils/bot'

// interface TypedRequestBody<T> extends Express.Request {
//   body: T
// }
// interface TypedResponse<ResBody> extends Express.Response {
//   json: Send<ResBody, this>
// }

export default (db: Database, bot: BotClient) => {
  bot.sendMessage('from controller.ts')
  const router = Router()
  const messages = buildRepository(db)

  router
    .route('/')
    .get(
      discordHandler(bot),
      jsonRoute(async (req: Request, res: Response) => {
        // console.log(res.locals.test)
        // bot.sendMessage(res.locals.fromDiscord)
        bot.sendMessage('from contrX')
        console.log('from contrX')
        if (Object.keys(req.query).length === 0) return messages.findAll()

        const {username, sprint} = req.query
        let record

        if (typeof username === 'string') {
          record = await messages.findByUsername(username)

          if (!record) throw new UserNotFound()
        } else if (typeof sprint === 'string') {
          record = await messages.findBySprint(sprint)
          if (!record) throw new SprintNotFound()
        } else throw new MessageNotFound()

        return record
      })
    )
    .post(
      jsonRoute(async (req: Request) => {
        const {body} = req
        const record = await createRec(db, body)

        if (record) {
          console.log('send msg to discord')
          bot.sendMessage('post')
          // return record
        }
        throw new Error('issue with record')
      })
    )

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const record = await messages.findById(id)

        if (!record) throw new MessageNotFound()
        return record
      })
    )
    .delete(
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const record = await messages.remove(id)

        if (!record) throw new MessageNotFound()
      }, StatusCodes.NO_CONTENT)
    )

  return router
}
