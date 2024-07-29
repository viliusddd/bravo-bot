import type {
  ExpressionOrFactory,
  Insertable,
  Selectable,
  SqlBool,
  Updateable
} from 'kysely'
import {keys} from './schema'
import type {Message, Database, DB} from '@/database'

// model-specific code
const TABLE = 'message'
type TableName = typeof TABLE
type Row = Message
type RowWithoutId = Omit<Row, 'id'>
type RowInsert = Insertable<RowWithoutId>
type RowUpdate = Updateable<RowWithoutId>
type RowSelect = Selectable<Row>

// in tests, we provide an in-memory SQLite database
// generic code that could be generalized further
export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute()
  },

  find(
    expression: ExpressionOrFactory<DB, TableName, SqlBool>
  ): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).where(expression).execute()
  },

  findById(id: number): Promise<RowSelect | undefined> {
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

  create(record: RowInsert): Promise<RowSelect | undefined> {
    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst()
  },

  update(id: number, partial: RowUpdate): Promise<RowSelect | undefined> {
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

  remove(id: number) {
    return db
      .deleteFrom(TABLE)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst()
  }
})
