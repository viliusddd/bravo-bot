import {type Request, Router} from 'express'
import {StatusCodes} from 'http-status-codes'
import {Database} from '@/database'
import {jsonRoute} from '@/utils/middleware'
import {UserNotFound} from './errors'
import * as schema from './schema'
import buildRepository from './repository'

export default (db: Database) => {
  const router = Router()
  const users = buildRepository(db)

  router
    .route('/')
    .get(jsonRoute(users.findAll))
    .post(
      jsonRoute(async (req: Request) => {
        const body = schema.parseInsertable(req.body)

        return users.create(body)
      }, StatusCodes.CREATED)
    )

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const record = await users.findById(id)

        if (!record) throw new UserNotFound()
        return record
      })
    )
    .patch(
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const bodyPatch = schema.parseUpdateable(req.body)
        const record = await users.update(id, bodyPatch)

        if (!record) throw new UserNotFound()
        return record
      })
    )
    .delete(
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const record = await users.remove(id)

        if (!record) throw new UserNotFound()
      }, StatusCodes.NO_CONTENT)
    )

  return router
}
