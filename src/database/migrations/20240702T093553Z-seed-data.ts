import {Kysely} from 'kysely'

export async function up(db: Kysely<any>) {
  const user = await db
    .insertInto('users')
    .values({name: 'vjuodz'})
    .executeTakeFirst()

  const sprint = await db
    .insertInto('sprints')
    .values({name: 'WD.3.2.5'})
    .executeTakeFirst()

  await db
    .insertInto('messages')
    .values({
      message: 'Message one body.',
      user_id: user.insertId,
      sprint_id: sprint.insertId
    })
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.deleteFrom('users').where('id', '=', '1').execute()
  await db.deleteFrom('sprints').where('id', '=', '1').execute()
  await db.deleteFrom('messages').where('user_id', '=', '1').execute()
}
