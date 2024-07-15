import {Selectable, Insertable} from 'kysely'
import {snakeToCamel, randFromArray} from './utils'
import emojisRepo from '../emojis/repository'
import praisesRepo from '../praises/repository'
import sprintsRepo from '../sprints/repository'
import templatesRepo from '../templates/repository'
import type {Database, Emoji, Message, Praise, Template} from '@/database'
import usersRepo from '../users/repository'
import messagesRepo from './repository'

type Row = Message
type RowWithoutId = Omit<Row, 'id' | 'createdOn'>

type RowInsert = Insertable<RowWithoutId>

type MessageRow = {
  username: string
  sprintCode: string
}

export async function createRec(
  db: Database,
  record: MessageRow
): Promise<RowInsert | undefined> {
  const users = usersRepo(db)
  const sprints = sprintsRepo(db)
  const templates = templatesRepo(db)
  const emojis = emojisRepo(db)
  const praises = praisesRepo(db)
  const messages = messagesRepo(db)

  const user = await users.findByUsername(record.username)
  const sprint = await sprints.findByCode(record.sprintCode)
  const templateList: Selectable<Template>[] = await templates.findAll()
  const emojiList: Selectable<Emoji>[] = await emojis.findAll()
  const praisesList: Selectable<Praise>[] = await praises.findAll()

  if (!sprint) throw new Error('Referenced sprint does not exist')
  if (!user) throw new Error('Referenced user does not exist')

  const {templateStr} = randFromArray(templateList)
  const templateKeys = {
    username: record.username,
    sprintTitle: sprint.sprintTitle,
    emojiStr: randFromArray(emojiList).emojiStr,
    praiseStr: randFromArray(praisesList).praiseStr
  }

  const messageStr = templMsg(templateStr, templateKeys)

  // if (user && sprint)
  return messages.create({
    userId: user.id,
    sprintId: sprint.id,
    messageStr
  })
}

/**
 * Replace values inside template, within brackets, with supplied values.
 */
export function templMsg(template: string, keys: {[x: string]: string}) {
  const regexp = /{([^{]*?)}/g
  const matches = template.match(regexp)

  if (!matches) {
    throw new Error('No matching patterns were found.')
  }

  return matches.reduce((accum, match) => {
    const key = snakeToCamel(match.replace(/[{}]/g, ''))

    return accum.replace(match, keys[key])
  }, template)
}
