import {type Request, Router} from 'express'
import {StatusCodes} from 'http-status-codes'
import {Database} from '@/database'
import {jsonRoute} from '@/utils/middleware'
import {TemplateNotFound} from './errors'
import * as schema from './schema'
import buildRepository from './repository'

export default (db: Database) => {
  const router = Router()
  const templates = buildRepository(db)

  router
    .route('/')
    .get(jsonRoute(templates.findAll))
    .post(
      jsonRoute(async (req: Request) => {
        const body = schema.parseInsertable(req.body)

        return templates.create(body)
      }, StatusCodes.CREATED)
    )

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const record = await templates.findById(id)

        if (!record) throw new TemplateNotFound()
        return record
      })
    )
    .patch(
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const bodyPatch = schema.parseUpdateable(req.body)
        const record = await templates.update(id, bodyPatch)

        if (!record) throw new TemplateNotFound()
        return record
      })
    )
    .delete(
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const record = await templates.remove(id)

        if (!record) throw new TemplateNotFound()
      }, StatusCodes.NO_CONTENT)
    )

  return router
}
