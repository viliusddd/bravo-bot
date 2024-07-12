import {Router} from 'express'
import {StatusCodes} from 'http-status-codes'
import {jsonRoute, unsupportedRoute} from '@/utils/middleware'
import buildRepository from './repository'
import * as schema from './schema'
import {PraiseNotFound} from './errors'
import {Database} from '@/database'

export default (db: Database) => {
  const router = Router()
  const praises = buildRepository(db)

  router
    .route('/')
    .get(jsonRoute(praises.findAll))
    .post(
      jsonRoute(async req => {
        const body = schema.parseInsertable(req.body)

        return praises.create(body)
      }, StatusCodes.CREATED)
    )

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async req => {
        const id = schema.parseId(req.params.id)
        const record = await praises.findById(id)
        console.log('test')
        console.log(record)

        if (!record) {
          throw new PraiseNotFound()
        }

        return record
      })
    )
    .patch(
      jsonRoute(async req => {
        const id = schema.parseId(req.params.id)
        const bodyPatch = schema.parseUpdateable(req.body)
        const record = await praises.update(id, bodyPatch)

        if (!record) {
          throw new PraiseNotFound()
        }

        return record
      })
    )
    .delete(unsupportedRoute)

  return router
}
