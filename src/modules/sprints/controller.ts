import {type Request, Router} from 'express'
import {StatusCodes} from 'http-status-codes'
import buildRepository from './repository'
import * as schema from './schema'
import {jsonRoute} from '@/utils/middleware'
import {SprintNotFound} from './errors'
import {Database} from '@/database'

export default (db: Database) => {
  const router = Router()
  const sprints = buildRepository(db)

  router
    .route('/')
    .get(jsonRoute(sprints.findAll))
    .post(
      jsonRoute(async req => {
        const body = schema.parseInsertable(req.body)

        return sprints.create(body)
      }, StatusCodes.CREATED)
    )

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async req => {
        const id = schema.parseId(req.params.id)
        const record = await sprints.findById(id)

        if (!record) {
          throw new SprintNotFound()
        }

        return record
      })
    )
    .patch(
      jsonRoute(async req => {
        const id = schema.parseId(req.params.id)
        const bodyPatch = schema.parseUpdateable(req.body)
        const record = await sprints.update(id, bodyPatch)

        if (!record) {
          throw new SprintNotFound()
        }

        return record
      })
    )
    .delete(
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const record = await sprints.remove(id)

        if (!record) throw new SprintNotFound()
      }, StatusCodes.NO_CONTENT)
    )

  return router
}
