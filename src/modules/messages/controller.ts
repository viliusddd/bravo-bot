import {Router} from 'express'
import {StatusCodes} from 'http-status-codes'
import type {Request, Response, NextFunction} from 'express'
import type {Database} from '@/database'
import {createRec} from './service'
import {discordHandler, jsonRoute, unsupportedRoute} from '@/utils/middleware'
import {MessageNotFound} from './errors'
import {SprintNotFound} from '../sprints/errors'
import {UserNotFound} from '../users/errors'
import BotClient from '@/services/discord'
import buildRepository from './repository'
import * as schema from './schema'

export default (db: Database, bot: any) => {
  const router = Router()
  const messages = buildRepository(db)

  router
    .route('/')
    .get(
      jsonRoute(async (req: Request) => {
        if (Object.keys(req.query).length === 0) return messages.findAll()

        const {username, sprintCode} = req.query
        let record

        if (typeof username === 'string') {
          record = await messages.findByUsername(username)
          if (!record) throw new UserNotFound()
        } else if (typeof sprintCode === 'string') {
          record = await messages.findBySprint(sprintCode)
          if (!record) throw new SprintNotFound()
        } else throw new MessageNotFound()

        return record
      })
    )
    .post(
      jsonRoute(async (req: Request, res: Response, next: NextFunction) => {
        const {username, sprintCode} = req.body

        const record = await createRec(db, username, sprintCode, bot)
        if (!record) throw new Error('Issue with record')

        res.locals.msg = record.messageStr

        next()

        return record
      }, StatusCodes.CREATED),
      discordHandler(bot)
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
    .patch(unsupportedRoute)

  return router
}
