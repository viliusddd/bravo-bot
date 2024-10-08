import 'dotenv/config'
import {Selectable, Insertable} from 'kysely'
import type BotClient from '@/services/discord'
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
import {IGNORE_DUPLICATE_MSG} from '@/config'

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

  const parsedUsername = userSchema.parseInsertable({username: username})
  const parsedSprint = sprintSchema.parseSprintCode({sprintCode: sprintCode})

  const user = await users.findByUsername(parsedUsername.username)
  const sprint = await sprints.findByCode(parsedSprint.sprintCode)

  if (!user) throw new Error("User doesn't exist.")
  if (!sprint) throw new Error("User doesn't exist.")

  const templateList: Selectable<Template>[] = await templates.findAll()
  const emojiList: Selectable<Emoji>[] = await emojis.findAll()
  const praisesList: Selectable<Praise>[] = await praises.findAll()
  const messagesList = await messages.findAll()

  const duplicateEntry = messagesList.some(
    entry => entry.userId === user.id && entry.sprintId === sprint.id
  )
  if (duplicateEntry && !IGNORE_DUPLICATE_MSG)
    throw new Error('Message with same username or sprintCode  exists.')

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
