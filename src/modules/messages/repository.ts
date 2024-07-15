import 'dotenv/config'
import {Selectable, Insertable, Updateable} from 'kysely'
import {keys} from './schema'
import type {Message, Database} from '@/database'

const TABLE = 'message'

type Row = Message
type RowWithoutId = Omit<Row, 'id' | 'createdOn'>

type RowInsert = Insertable<RowWithoutId>
type RowUpdate = Updateable<RowWithoutId>
type RowSelect = Selectable<Row>

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

  async create(record: RowInsert): Promise<RowSelect | undefined> {
    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst()
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
