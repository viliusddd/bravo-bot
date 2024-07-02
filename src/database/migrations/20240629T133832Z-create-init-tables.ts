import {Kysely} from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('users')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .addColumn('name', 'text', c => c.notNull())
    .execute()

  await db.schema
    .createTable('sprints')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .addColumn('name', 'text', c => c.notNull())
    .execute()

  await db.schema
    .createTable('messages')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .addColumn('message', 'text', c => c.notNull())
    .addColumn('user_id', 'integer', c => c.notNull().references('users.id'))
    .addColumn('sprint_id', 'integer', c =>
      c.notNull().references('sprints.id')
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('users').execute()
  await db.schema.dropTable('sprint').execute()
  await db.schema.dropTable('messages').execute()
}
