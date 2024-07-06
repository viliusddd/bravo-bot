import 'dotenv/config'
import SQLite from 'better-sqlite3'
import {Kysely, SqliteDialect, Selectable} from 'kysely'

import type {DB, Messages} from '@/database/types'

const {DATABASE_URL} = process.env

const dialect = new SqliteDialect({database: new SQLite(DATABASE_URL)})
const db = new Kysely<DB>({dialect})

type Row = Messages
type RowSelect = Selectable<Row>

// export function findAll(): Promise<Messages[]> {
export async function findAll(): Promise<RowSelect[]> {
  const data: Promise<RowSelect[]> = db
    .selectFrom('messages')
    .selectAll()
    .execute()
  return data
}
