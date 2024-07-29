import 'dotenv/config'
import {Selectable, Insertable} from 'kysely'
import type BotClient from '@/utils/bot'
import {snakeToCamel, randFromArray} from './utils'
import emojisRepo from '../emojis/repository'
import praisesRepo from '../praises/repository'
import sprintsRepo from '../sprints/repository'
import templatesRepo from '../templates/repository'
import type {Database, Emoji, Message, Praise, Template} from '@/database'
import usersRepo from '../users/repository'
import messagesRepo from './repository'
import * as userSchema from '@/modules/users/schema'
import * as sprintSchema from '@/modules/sprints/schema'

type Row = Message
type RowWithoutId = Omit<Row, 'id' | 'createdOn'>

type RowInsert = Insertable<RowWithoutId>

export async function createRec(
  db: Database,
  username: string,
  sprintCode: string,
  bot: BotClient
): Promise<RowInsert | undefined> {
  const users = usersRepo(db)
  const sprints = sprintsRepo(db)
  const templates = templatesRepo(db)
  const emojis = emojisRepo(db)
  const praises = praisesRepo(db)
  const messages = messagesRepo(db)

  const user = userSchema.parse(await users.findByUsername(username))
  const sprint = sprintSchema.parse(await sprints.findByCode(sprintCode))
  const templateList: Selectable<Template>[] = await templates.findAll()
  const emojiList: Selectable<Emoji>[] = await emojis.findAll()
  const praisesList: Selectable<Praise>[] = await praises.findAll()
  const messagesList = await messages.findAll()

  const duplicateEntry = messagesList.some(
    msg => msg.userId === user.id && msg.sprintId === sprint.id
  )
  if (duplicateEntry)
    throw new Error('Message with same username & sprintCode  exists.')

  const discordUserId = await bot.getUserIdFromNickname(user.username)

  const {templateStr} = randFromArray(templateList)
  const templateKeys = {
    username: discordUserId ? `<@${discordUserId}>` : user.username,
    sprintTitle: sprint.sprintTitle,
    emojiStr: randFromArray(emojiList).emojiStr,
    praiseStr: randFromArray(praisesList).praiseStr
  }

  const messageStr = templMsg(templateStr, templateKeys)

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
