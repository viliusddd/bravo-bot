import 'dotenv/config'
import * as path from 'path'
import {promises as fs} from 'fs'
import {Kysely, Migrator, FileMigrationProvider, SqliteDialect} from 'kysely'
import SQLite, {type Database} from 'better-sqlite3'

import {fileURLToPath} from 'url'
import {dirname} from 'path'

const filename = fileURLToPath(import.meta.url)

async function migrateToLatest(url: string) {
  const db = new Kysely<Database>({
    dialect: new SqliteDialect({
      database: new SQLite(url)
    })
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(dirname(filename), 'migrations')
    })
  })

  const {error, results} = await migrator.migrateToLatest()

  results?.forEach(it => {
    if (it.status === 'Success')
      console.log(`migration "${it.migrationName}" was executed successfully`)
    else if (it.status === 'Error')
      console.error(`failed to execute migration "${it.migrationName}"`)
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest(process.env.DATABASE_URL)
