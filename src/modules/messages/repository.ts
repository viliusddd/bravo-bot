import 'dotenv/config'
import {Selectable, Insertable, Updateable} from 'kysely'
import {keys} from './schema'
import {randFromArray} from './utils'
import {templMsg} from './services'
import emojisRepo from '../emojis/repository'
import praisesRepo from '../praises/repository'
import sprintsRepo from '../sprints/repository'
import templatesRepo from '../templates/repository'
import type {Message, Database, Emoji, Praise, Template} from '@/database'
import usersRepo from '../users/repository'

const TABLE = 'message'

type Row = Message
type RowWithoutId = Omit<Row, 'id' | 'createdOn'>

type RowInsert = Insertable<RowWithoutId>
type RowUpdate = Updateable<RowWithoutId>
type RowSelect = Selectable<Row>

type MessageRow = {
  username: string
  sprintCode: string
}

export default (db: Database) => ({
  findAll() {
    return db
      .selectFrom(TABLE)
      .innerJoin('user', 'user.id', 'message.userId')
      .innerJoin('sprint', 'sprint.id', 'message.sprintId')
      .select(['message.id', 'username', 'sprintCode', 'messageStr'])
      .execute()
  },

  findById(id: number) {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst()
  },

  findByUsername(username: string) {
    return db
      .selectFrom(TABLE)
      .innerJoin('user', 'user.id', 'message.userId')
      .innerJoin('sprint', 'sprint.id', 'message.sprintId')
      .select(['message.id', 'username', 'sprintCode', 'messageStr'])
      .where('username', '=', username)
      .execute()
  },

  findBySprint(sprintCode: string) {
    return db
      .selectFrom(TABLE)
      .innerJoin('user', 'user.id', 'message.userId')
      .innerJoin('sprint', 'sprint.id', 'message.sprintId')
      .select(['message.id', 'username', 'sprintCode', 'messageStr'])
      .where('sprintCode', '=', sprintCode)
      .execute()
  },

  async create(record: MessageRow): Promise<RowInsert | undefined> {
    const users = usersRepo(db)
    const sprints = sprintsRepo(db)
    const templates = templatesRepo(db)
    const emojis = emojisRepo(db)
    const praises = praisesRepo(db)

    const user = await users.findByUsername(record.username)
    const sprint = await sprints.findByCode(record.sprintCode)
    const templateList: Selectable<Template>[] = await templates.findAll()
    const emojiList: Selectable<Emoji>[] = await emojis.findAll()
    const praisesList: Selectable<Praise>[] = await praises.findAll()

    if (!sprint) throw new Error('Referenced sprint does not exist')

    const {templateStr} = randFromArray(templateList)
    const templateKeys = {
      username: record.username,
      sprintTitle: sprint.sprintTitle,
      emojiStr: randFromArray(emojiList).emojiStr,
      praiseStr: randFromArray(praisesList).praiseStr
    }

    const messageStr = templMsg(templateStr, templateKeys)

    if (user && sprint)
      return db
        .insertInto(TABLE)
        .values({
          userId: user.id,
          sprintId: sprint.id,
          messageStr
        })
        .returning(keys)
        .executeTakeFirst()
    throw new Error('tmp err')
  },

  async update(id: number, partial: RowUpdate): Promise<RowSelect | undefined> {
    if (Object.keys(partial).length === 0) {
      return this.findById(id)
    }
    return db
      .updateTable(TABLE)
      .set(partial)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst()
  },

  async remove(id: number) {
    return db
      .deleteFrom(TABLE)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst()
  }
})
