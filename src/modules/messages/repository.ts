import 'dotenv/config'
import SQLite from 'better-sqlite3'
import {
  Kysely,
  KyselyPlugin,
  CamelCasePlugin,
  SqliteDialect,
  Selectable,
  Insertable,
  Updateable
} from 'kysely'
import type {User, Message, Database, DB} from '@/database'
import {randFromArray} from './utils'
import {keys} from './schema'

const {DATABASE_URL} = process.env
const TABLE = 'message'

type TableName = typeof TABLE
type Row = Message
type RowWithoutId = Omit<Row, 'id'>
type RowRelationshipsIds = Pick<
  Row,
  'emojiId' | 'praiseId' | 'sprintId' | 'templateId' | 'userId'
>

type RowInsert = Insertable<RowWithoutId>
type RowUpdate = Updateable<RowWithoutId>
type RowSelect = Selectable<Row>

export default (db: Database) => ({
  findAll() {
    return db
      .selectFrom(TABLE)
      .innerJoin('emoji', 'emoji.id', 'message.emojiId')
      .innerJoin('user', 'user.id', 'message.userId')
      .innerJoin('sprint', 'sprint.id', 'message.sprintId')
      .innerJoin('praise', 'praise.id', 'message.praiseId')
      .innerJoin('template', 'template.id', 'message.templateId')
      .select(['username', 'title', 'praiseStr', 'templateStr', 'emojiStr'])
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
      .innerJoin('emoji', 'emoji.id', 'message.emojiId')
      .innerJoin('user', 'user.id', 'message.userId')
      .innerJoin('sprint', 'sprint.id', 'message.sprintId')
      .innerJoin('praise', 'praise.id', 'message.praiseId')
      .innerJoin('template', 'template.id', 'message.templateId')
      .select(['username', 'title', 'praiseStr', 'templateStr', 'emojiStr'])
      .where('username', '=', username)
      .executeTakeFirst()
  },

  findBySprint(sprint: string) {
    return db
      .selectFrom(TABLE)
      .innerJoin('emoji', 'emoji.id', 'message.emojiId')
      .innerJoin('user', 'user.id', 'message.userId')
      .innerJoin('sprint', 'sprint.id', 'message.sprintId')
      .innerJoin('praise', 'praise.id', 'message.praiseId')
      .innerJoin('template', 'template.id', 'message.templateId')
      .select(['username', 'title', 'praiseStr', 'templateStr', 'emojiStr'])
      .where('code', '=', sprint)
      .executeTakeFirst()
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
  },

  /** Enforce that provided relationships reference existing keys. */
  async assertRelationshipsExist(
    // db: Kysely<DB>,
    record: Partial<RowRelationshipsIds>
  ) {
    const {emojiId, praiseId, sprintId, templateId, userId} = record

    // we would perform both checks in a single Promise.all
    if (emojiId) {
      const emoji = await db
        .selectFrom('emoji')
        .select('id')
        .where('id', '=', emojiId)
        .executeTakeFirst()

      if (!emoji) {
        throw new Error('Referenced emoji does not exist')
      }
    }

    if (praiseId) {
      const praise = await db
        .selectFrom('praise')
        .select('id')
        .where('id', '=', praiseId)
        .executeTakeFirst()

      if (!praise) {
        throw new Error('Referenced praise does not exist')
      }
    }

    if (sprintId) {
      const sprint = await db
        .selectFrom('sprint')
        .select('id')
        .where('id', '=', sprintId)
        .executeTakeFirst()

      if (!sprint) {
        throw new Error('Referenced sprint does not exist')
      }
    }

    if (templateId) {
      const template = await db
        .selectFrom('template')
        .select('id')
        .where('id', '=', templateId)
        .executeTakeFirst()

      if (!template) {
        throw new Error('Referenced template does not exist')
      }
    }

    if (userId) {
      const user = await db
        .selectFrom('user')
        .select('id')
        .where('id', '=', userId)
        .executeTakeFirst()

      if (!user) {
        throw new Error('Referenced user does not exist')
      }
    }
  }
})
