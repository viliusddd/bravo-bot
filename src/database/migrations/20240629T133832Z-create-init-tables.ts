import {type Kysely} from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('user')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .addColumn('username', 'text', c => c.notNull().unique())
    .execute()

  await db.schema
    .createTable('sprint')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .addColumn('sprint_code', 'text', c => c.notNull().unique())
    .addColumn('sprint_title', 'text', c => c.notNull().unique())
    .execute()

  await db.schema
    .createTable('praise')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .addColumn('praise_str', 'text', c => c.notNull().unique())
    .execute()

  await db.schema
    .createTable('template')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .addColumn('template_str', 'text', c => c.notNull().unique())
    .execute()

  await db.schema
    .createTable('emoji')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .addColumn('emoji_str', 'text', c => c.notNull().unique())
    .execute()

  await db.schema
    .createTable('message')
    .addColumn('id', 'integer', c => c.notNull().primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', c =>
      c.notNull().references('user.id').onDelete('cascade')
    )
    .addColumn('sprint_id', 'integer', c =>
      c.notNull().references('sprint.id').onDelete('cascade')
    )
    .addColumn('message_str', 'text', c => c.notNull().unique())
    .addColumn('created_on', 'timestamptz', c =>
      c.defaultTo(new Date().toISOString()).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('user').execute()
  await db.schema.dropTable('sprint').execute()
  await db.schema.dropTable('praise').execute()
  await db.schema.dropTable('template').execute()
  await db.schema.dropTable('message').execute()
  await db.schema.dropTable('emoji').execute()
}
