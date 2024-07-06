import {Router, Request, Response} from 'express'
import {Send} from 'express-serve-static-core'
import {findAll} from './repository'
import {templMsg} from './utils'

const router = Router()

interface TypedRequestBody<T> extends Express.Request {
  body: T
}

export interface TypedResponse<ResBody> extends Express.Response {
  json: Send<ResBody, this>
}

router
  .route('/')
  .post(
    (
      req: TypedRequestBody<{username: string; sprintCode: string}>,
      res: Response
    ) => {
      const {username, sprintCode} = req.body
      if (!username || !sprintCode) {
        res.sendStatus(400)
        return // return complete message?
      }

      res.json({userId: 0})
    }
  )
  .get(
    async (
      req: Request,
      res: TypedResponse<
        {
          username: string
          title: string
          praise: string
          template: string
        }[]
      >
    ) => {
      const rows = await findAll()

      const newRows = rows.map(row =>
        templMsg(row.template, (({template, ...rest}) => rest)(row))
      )

      console.log(newRows)

      // TODO: this should return array with messages [{username: message}, ...] ?
      return res.json(rows)
    }
  )

export default router
