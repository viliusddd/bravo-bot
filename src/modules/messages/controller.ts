import {Router, type Request, type Response} from 'express'
import {Send} from 'express-serve-static-core'
import {StatusCodes} from 'http-status-codes'
import {log} from 'console'
import type {Database} from '@/database'
import buildRepository from './repository'
import {templMsg} from './services'
import {jsonRoute, unsupportedRoute} from '@/utils/middleware'
import * as schema from './schema'
import {MessageNotFound} from './errors'

interface TypedRequestBody<T> extends Express.Request {
  body: T
}
interface TypedResponse<ResBody> extends Express.Response {
  json: Send<ResBody, this>
}

export default (db: Database) => {
  const router = Router()
  const messages = buildRepository(db)

  router.route('/').get(
    jsonRoute(async (req: Request) => {
      if (Object.keys(req.query).length === 0) return messages.findAll()

      const {username, sprint} = req.query
      let record

      if (typeof username === 'string')
        record = messages.findByUsername(username)
      else if (typeof sprint === 'string')
        record = messages.findBySprint(sprint)
      else throw new MessageNotFound()

      return record
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
    .patch(
      //! needs fixing
      jsonRoute(async (req: Request) => {
        const id = schema.parseId(req.params.id)
        const bodyPatch = schema.parseUpdateable(req.body)
        const record = await messages.update(id, bodyPatch)

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
