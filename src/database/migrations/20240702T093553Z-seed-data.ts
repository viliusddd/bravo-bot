import {type Kysely} from 'kysely'

type QueryReturn = Array<{[x: string]: string}>

export async function up(db: Kysely<any>) {
  const user: QueryReturn = await db
    .insertInto('user')
    .values([
      {username: 'vjuodz'},
      {username: 'ddidzi'},
      {username: 'rbeniu'},
      {username: 'augriga'},
      {username: 'jiylee'}
    ])
    .returningAll()
    .execute()

  const sprint: QueryReturn = await db
    .insertInto('sprint')
    .values([
      {
        sprint_code: 'WD-1.1.5',
        sprint_title: 'First Steps Into Programming with Python'
      },
      {
        sprint_code: 'WD-1.2.5',
        sprint_title: 'Intermediate Programming with Python'
      },
      {sprint_code: 'WD-1.3.4', sprint_title: 'Object Oriented Programming'},
      {sprint_code: 'WD-1.4.4', sprint_title: 'Computer Science Fundamentals'},
      {
        sprint_code: 'WD-2.1.5',
        sprint_title: 'HTML and CSS - the Foundation of Web Pages'
      },
      {
        sprint_code: 'WD-2.2.5',
        sprint_title: 'Improving Websites with Javascript'
      },
      {
        sprint_code: 'WD-2.3.5',
        sprint_title: 'Learning Your First Framework - Vue.js'
      },
      {sprint_code: 'WD-2.4.5', sprint_title: 'Typing and Testing JavaScript'},
      {
        sprint_code: 'WD-3.1.5',
        sprint_title: 'Node.js and Relational Databases'
      },
      {
        sprint_code: 'WD-3.2.5',
        sprint_title: 'REST APIs & Test Driven Development'
      },
      {sprint_code: 'WD-3.3.5', sprint_title: 'Full-stack Fundamentals'},
      {sprint_code: 'WD-3.4.4', sprint_title: 'Containers and CI/CD'}
    ])
    .returningAll()
    .execute()

  const praise: QueryReturn = await db
    .insertInto('praise')
    .values([
      {
        praise_str:
          "You've accomplished something truly amazing! Congratulations on your achievement!"
      },
      {
        praise_str:
          'You should be so proud of yourself for all of the hard work you put in to reach your goal. Congrats!'
      },
      {
        praise_str:
          'Your determination and perseverance have paid off in a big way. Congratulations on your success!'
      },
      {
        praise_str:
          "Congratulations on reaching such a significant milestone. You've earned every bit of recognition coming your way."
      },
      {
        praise_str:
          'Your achievement is a testament to your talent, passion, and hard work. Keep up the great work!'
      },
      {
        praise_str:
          "I'm so impressed by your dedication and commitment to achieving your goal. Congratulations on your accomplishment!"
      },
      {
        praise_str:
          'You are an inspiration to us all with your incredible achievement. Congratulations and keep reaching for the stars!'
      },
      {
        praise_str:
          'You have set the bar high for all of us with your amazing accomplishment. Congratulations on your success!'
      },
      {
        praise_str:
          'This impressive achievement has paid off your hard work and dedication. Congrats!'
      },
      {
        praise_str:
          'You are proof that anything is possible with hard work, determination, and perseverance. Congratulations on your achievement!'
      }
    ])
    .returningAll()
    .execute()

  const emoji: QueryReturn = await db
    .insertInto('emoji')
    .values([
      {emoji_str: '🥳'},
      {emoji_str: '🎊'},
      {emoji_str: '🍾🍾🍾'},
      {emoji_str: '🥂'},
      {emoji_str: '🙌🙌🙌'},
      {emoji_str: '✊'},
      {emoji_str: '🤜🤛'},
      {emoji_str: '🎉🎉🎉'},
      {emoji_str: '🎆🎆🎆'},
      {emoji_str: '🤩'}
    ])
    .returningAll()
    .execute()

  await db
    .insertInto('template')
    .values([
      {
        template_str:
          '{username} has just completed {sprint_title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          '{username} has successfully completed {sprint_title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          'Big congratulations to {username} for finishing {sprint_title} {praise_str} {emoji_str}!'
      },
      {
        template_str:
          '{username} has nailed {sprint_title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          'Kudos to {username} for completing {sprint_title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          'Great job {username} on wrapping up {sprint_title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          'Hats off to {username} for finishing {sprint_title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          '{username} has just conquered {sprint_title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          'Well done {username} for completing {sprint_title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          'Awesome work, {username}, on finishing  {sprint_title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          '{username} has achieved {sprint_title}! {praise_str} {emoji_str}'
      }
    ])
    .returningAll()
    .execute()

  await db
    .insertInto('message')
    .values([
      {
        user_id: user[0].id,
        sprint_id: sprint[1].id,
        message_str: `Awesome work, ${user[0].username}, on finishing  ${sprint[3].sprint_title}! ${praise[4].praise_str} ${emoji[5].emoji_str}`
      },
      {
        user_id: user[0].id,
        sprint_id: sprint[2].id,
        message_str: `${user[0].username} has achieved ${sprint[2].sprint_title}! ${praise[3].praise_str} ${emoji[4].emoji_str}`
      },
      {
        user_id: user[1].id,
        sprint_id: sprint[2].id,
        message_str: `Hats off to ${user[3].username} for finishing ${sprint[4].sprint_title}! ${praise[5].praise_str} ${emoji[6].emoji_str}`
      },
      {
        user_id: user[2].id,
        sprint_id: sprint[3].id,
        message_str: `${user[4].username} has achieved ${sprint[5].sprint_title} ${emoji[7].emoji_str}! ${praise[6].praise_str}`
      }
    ])
    .returningAll()
    .execute()
}

export async function down(db: Kysely<any>) {
  await db
    .deleteFrom('user')
    .where('username', 'in', [
      'vjuodz',
      'ddidzi',
      'rbeniu',
      'augriga',
      'jiylee'
    ])
    .execute()

  await db
    .deleteFrom('sprint')
    .where('id', 'in', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    .execute()

  await db
    .deleteFrom('praise')
    .where('id', 'in', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .execute()

  await db
    .deleteFrom('template')
    .where('id', 'in', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .execute()

  await db
    .deleteFrom('emoji')
    .where('id', 'in', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .execute()

  await db.deleteFrom('message').where('id', 'in', [1, 2, 3, 4]).execute()
}
