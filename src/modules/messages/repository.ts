import 'dotenv/config'
import SQLite from 'better-sqlite3'
import {Kysely, KyselyPlugin, CamelCasePlugin, SqliteDialect} from 'kysely'
import type {JoinedRows} from './types'

import type {DB} from '@/database/types'

const {DATABASE_URL} = process.env

const plugins: KyselyPlugin[] = [new CamelCasePlugin()]
const dialect = new SqliteDialect({database: new SQLite(DATABASE_URL)})
const db = new Kysely<DB>({dialect, plugins})

export async function findAll() {
  const data: JoinedRows[] = await db
    .selectFrom('messages')
    .innerJoin('users', 'users.id', 'messages.userId')
    .innerJoin('sprints', 'sprints.id', 'messages.sprintId')
    .innerJoin('praises', 'praises.id', 'messages.praiseId')
    .innerJoin('templates', 'templates.id', 'messages.templateId')
    .select(['username', 'sprints.title', 'praise', 'template'])
    .execute()
  return data
}
