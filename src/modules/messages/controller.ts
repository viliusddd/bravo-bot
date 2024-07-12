import {Router, Request, Response} from 'express'
import {Send} from 'express-serve-static-core'
import {findAll, addMsg} from './repository'
import {templMsg} from './services'

const router = Router()

interface TypedRequestBody<T> extends Express.Request {
  body: T
}
export interface TypedResponse<ResBody> extends Express.Response {
  json: Send<ResBody, this>
}

type Keys = {
  username: string
  title: string
  praiseStr: string
  emojiStr: string
}

router
  .route('/')
  .post(
    async (
      req: TypedRequestBody<{username: string; sprintCode: string}>,
      res: Response
    ) => {
      const {username, sprintCode} = req.body
      if (!username || !sprintCode) {
        res.sendStatus(400)
        return // return complete message?
      }

      const result = await addMsg({username, sprintCode})
      res.json(result)
    }
  )
  .get(async (req: Request, res: TypedResponse<string[]>) => {
    const rows = await findAll()
    console.log(rows)

    const newRows = rows.map(row => {
      const keys: Keys = (({templateStr, ...rest}): Keys => rest)(row)

      return templMsg(row.templateStr, keys)
    })

    return res.json(newRows)
  })

export default router
