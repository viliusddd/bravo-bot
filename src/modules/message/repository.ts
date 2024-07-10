import 'dotenv/config'
import SQLite from 'better-sqlite3'
import {
  Kysely,
  KyselyPlugin,
  CamelCasePlugin,
  SqliteDialect,
  Selectable,
  Simplify,
  Insertable
} from 'kysely'
import type {JoinedRows} from './types'

import type {DB, Message} from '@/database/types'
import {randFromArray} from './utils'

const {DATABASE_URL} = process.env

const plugins: KyselyPlugin[] = [new CamelCasePlugin()]
const dialect = new SqliteDialect({database: new SQLite(DATABASE_URL)})
const db = new Kysely<DB>({dialect, plugins})

export async function findAll() {
  const data = await db
    .selectFrom('message')
    .innerJoin('emoji', 'emoji.id', 'message.emojiId')
    .innerJoin('user', 'user.id', 'message.userId')
    .innerJoin('sprint', 'sprint.id', 'message.sprintId')
    .innerJoin('praise', 'praise.id', 'message.praiseId')
    .innerJoin('template', 'template.id', 'message.templateId')
    .select(['username', 'title', 'praiseStr', 'templateStr', 'emojiStr'])
    .execute()
  return data
}

//  as Selectable<Message> | undefined
export async function addMsg({
  username,
  sprintCode
}: {
  username: string
  sprintCode: string
}) {
  let user

  user = await db
    .selectFrom('user')
    .selectAll()
    .where('username', '=', username)
    .executeTakeFirst()

  if (!user) {
    user = await db
      .insertInto('user')
      .values({username})
      .returningAll()
      .executeTakeFirst()
  }

  if (user) {
    const praise = await db.selectFrom('praise').selectAll().execute()
    const template = await db.selectFrom('template').selectAll().execute()
    const emoji = await db.selectFrom('emoji').selectAll().execute()

    return db
      .insertInto('message')
      .values({
        emojiId: randFromArray(emoji).id,
        userId: user.id,
        sprintId: sprintCode,
        praiseId: randFromArray(praise).id,
        templateId: randFromArray(template).id
      })
      .returningAll()
      .executeTakeFirst()
  }
}
