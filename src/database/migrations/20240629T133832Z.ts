import {Kysely} from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('users')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .execute()

  await db.schema
    .createTable('sprint')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .execute()

  await db.schema
    .createTable('messages')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .addColumn('message', 'text', c => c.notNull())
    .addColumn('user_id', 'integer', c => c.notNull().references('users.id'))
    .execute()
}
