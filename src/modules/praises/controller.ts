import {type Request, Router} from 'express'
import {StatusCodes} from 'http-status-codes'
import {Database} from '@/database'
import {jsonRoute} from '@/utils/middleware'
import {PraiseNotFound} from './errors'
import * as schema from './schema'
import buildRepository from './repository'

export default (db: Database) => {
  const router = Router()
  const praises = buildRepository(db)

  router
    .route('/')
    .get(jsonRoute(praises.findAll))
    .post(
      jsonRoute(async (req: Request) => {
        const body = schema.parseInsertable(req.body)

        return praises.create(body)
      }, StatusCodes.CREATED)
    )

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const record = await praises.findById(id)

        if (!record) throw new PraiseNotFound()
        return record
      })
    )
    .patch(
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const bodyPatch = schema.parseUpdateable(req.body)
        const record = await praises.update(id, bodyPatch)

        if (!record) throw new PraiseNotFound()
        return record
      })
    )
    .delete(
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const record = await praises.remove(id)

        if (!record) throw new PraiseNotFound()
      }, StatusCodes.NO_CONTENT)
    )

  return router
}
