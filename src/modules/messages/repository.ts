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

import type {DB, User, Message} from '@/database/types'
import {randFromArray} from './utils'

const {DATABASE_URL} = process.env

const plugins: KyselyPlugin[] = [new CamelCasePlugin()]
const dialect = new SqliteDialect({database: new SQLite(DATABASE_URL)})
const db = new Kysely<DB>({dialect, plugins})

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

export async function findAll() {
  const data = await db
    .selectFrom(TABLE)
    .innerJoin('emoji', 'emoji.id', 'message.emojiId')
    .innerJoin('user', 'user.id', 'message.userId')
    .innerJoin('sprint', 'sprint.id', 'message.sprintId')
    .innerJoin('praise', 'praise.id', 'message.praiseId')
    .innerJoin('template', 'template.id', 'message.templateId')
    .select(['username', 'title', 'praiseStr', 'templateStr', 'emojiStr'])
    .execute()
  return data
}

async function findUser(
  username: string
): Promise<Selectable<User> | undefined> {
  return db
    .selectFrom('user')
    .selectAll()
    .where('username', '=', username)
    .executeTakeFirst()
}

async function createUser(
  username: string
): Promise<Insertable<User> | undefined> {
  return db
    .insertInto('user')
    .values({username})
    .returning('id')
    .executeTakeFirst()
}

//  as Selectable<Message> | undefined
export async function addMsg({
  username,
  sprintCode
}: {
  username: string
  sprintCode: string
}) {
  await assertRelationshipsExist(db, record)

  const praise = await db.selectFrom('praise').selectAll().execute()
  const template = await db.selectFrom('template').selectAll().execute()
  const emoji = await db.selectFrom('emoji').selectAll().execute()

  return db
    .insertInto('message')
    .values({
      emojiId: randFromArray(emoji).id,
      userId: (await findUser(username)).id,
      sprintId: sprintCode,
      praiseId: randFromArray(praise).id,
      templateId: randFromArray(template).id
    })
    .returningAll()
    .executeTakeFirst()
}

/**
 * Enforce that provided relationships reference existing keys.
 */
async function assertRelationshipsExist(
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
