import {type Request, Router} from 'express'
import {StatusCodes} from 'http-status-codes'
import {Database} from '@/database'
import {jsonRoute} from '@/utils/middleware'
import {EmojiNotFound} from './errors'
import * as schema from './schema'
import buildRepository from './repository'

export default (db: Database) => {
  const router = Router()
  const emojis = buildRepository(db)

  router
    .route('/')
    .get(jsonRoute(emojis.findAll))
    .post(
      jsonRoute(async (req: Request) => {
        const body = schema.parseInsertable(req.body)

        return emojis.create(body)
      }, StatusCodes.CREATED)
    )

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const record = await emojis.findById(id)

        if (!record) throw new EmojiNotFound()
        return record
      })
    )
    .patch(
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const bodyPatch = schema.parseUpdateable(req.body)
        const record = await emojis.update(id, bodyPatch)

        if (!record) throw new EmojiNotFound()
        return record
      })
    )
    .delete(
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const record = await emojis.remove(id)

        if (!record) throw new EmojiNotFound()
      }, StatusCodes.NO_CONTENT)
    )

  return router
}
