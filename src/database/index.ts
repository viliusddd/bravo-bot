import {DB} from './types'
import SQLite from 'better-sqlite3'
import {Kysely, KyselyPlugin, SqliteDialect} from 'kysely'
import {CamelCasePlugin} from 'kysely'

export default function createDB(url: string) {
  const dialect = new SqliteDialect({database: new SQLite(url)})
  const plugins: KyselyPlugin[] = [new CamelCasePlugin()]

  return new Kysely<DB>({dialect, plugins})
}

export * from './types'
