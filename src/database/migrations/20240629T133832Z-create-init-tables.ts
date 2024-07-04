import {type Kysely, sql} from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('users')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .addColumn('username', 'text', c => c.notNull().unique())
    .execute()

  await db.schema
    .createTable('sprints')
    .addColumn('id', 'text', c => c.notNull().primaryKey())
    .addColumn('title', 'text', c => c.notNull().unique())
    .execute()

  await db.schema
    .createTable('messages')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .addColumn('message', 'text', c => c.notNull().unique())
    .execute()

  await db.schema
    .createTable('templates')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .addColumn('template', 'text', c => c.notNull().unique())
    .execute()

  await db.schema
    .createTable('shoutouts')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', c =>
      c.notNull().references('users.id').onDelete('cascade')
    )
    .addColumn('sprint_id', 'integer', c =>
      c.notNull().references('sprints.id').onDelete('cascade')
    )
    .addColumn('message_id', 'integer', c =>
      c.notNull().references('messages.id').onDelete('cascade')
    )
    .addColumn('template_id', 'integer', c =>
      c.notNull().references('templates.id').onDelete('cascade')
    )
    .addColumn('timestamp', 'text', c =>
      c.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('users').execute()
  await db.schema.dropTable('sprints').execute()
  await db.schema.dropTable('messages').execute()
  await db.schema.dropTable('templates').execute()
  await db.schema.dropTable('shoutouts').execute()
}
