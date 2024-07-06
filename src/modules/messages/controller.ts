import {Router, Request, Response} from 'express'
import {findAll} from './repository'

const router = Router()

router
  .route('/')
  .post((req: Request, res: Response) => {
    const {username, sprintCode} = req.body
    if (!username || !sprintCode) {
      res.sendStatus(400)
      return // return complete message?
    }

    res.json({userId: 0})
  })
  .get(async (req: Request, res: Response) => res.json(await findAll()))

export default router
