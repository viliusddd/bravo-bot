import SQLite from 'better-sqlite3'
import {Kysely, KyselyPlugin, SqliteDialect, CamelCasePlugin} from 'kysely'
import {DB} from './types'

export default function createDB(url: string) {
  const dialect = new SqliteDialect({database: new SQLite(url)})
  const plugins: KyselyPlugin[] = [new CamelCasePlugin()]

  return new Kysely<DB>({dialect, plugins})
}

export * from './types'
