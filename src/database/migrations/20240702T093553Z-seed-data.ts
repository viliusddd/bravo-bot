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
      {id: 'WD-1.1.5', title: 'First Steps Into Programming with Python'},
      {id: 'WD-1.2.5', title: 'Intermediate Programming with Python'},
      {id: 'WD-1.3.4', title: 'Object Oriented Programming'},
      {id: 'WD-1.4.4', title: 'Computer Science Fundamentals'},
      {id: 'WD-2.1.5', title: 'HTML and CSS - the Foundation of Web Pages'},
      {id: 'WD-2.2.5', title: 'Improving Websites with Javascript'},
      {id: 'WD-2.3.5', title: 'Learning Your First Framework - Vue.js'},
      {id: 'WD-2.4.5', title: 'Typing and Testing JavaScript'},
      {id: 'WD-3.1.5', title: 'Node.js and Relational Databases'},
      {id: 'WD-3.2.5', title: 'REST APIs & Test Driven Development'},
      {id: 'WD-3.3.5', title: 'Full-stack Fundamentals'},
      {id: 'WD-3.4.4', title: 'Containers and CI/CD'}
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

  const template: QueryReturn = await db
    .insertInto('template')
    .values([
      {
        template_str:
          '{username} has just completed {title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          '{username} has successfully completed {title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          'Big congratulations to {username} for finishing {title} {praise_str} {emoji_str}!'
      },
      {
        template_str: '{username} has nailed {title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          'Kudos to {username} for completing {title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          'Great job {username} on wrapping up {title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          'Hats off to {username} for finishing {title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          '{username} has just conquered {title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          'Well done {username} for completing {title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          'Awesome work, {username}, on finishing  {title}! {praise_str} {emoji_str}'
      },
      {
        template_str:
          '{username} has achieved {title}! {praise_str} {emoji_str}'
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
        praise_id: praise[2].id,
        template_id: template[3].id,
        emoji_id: emoji[4].id
      },
      {
        user_id: user[1].id,
        sprint_id: sprint[2].id,
        praise_id: praise[3].id,
        template_id: template[4].id,
        emoji_id: emoji[5].id
      },
      {
        user_id: user[2].id,
        sprint_id: sprint[3].id,
        praise_id: praise[4].id,
        template_id: template[5].id,
        emoji_id: emoji[6].id
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
    .where('id', 'in', [
      'WD-1.1.5',
      'WD-1.2.5',
      'WD-1.3.4',
      'WD-1.4.4',
      'WD-2.1.5',
      'WD-2.2.5',
      'WD-2.3.5',
      'WD-2.4.5',
      'WD-3.1.5',
      'WD-3.2.5',
      'WD-3.3.5',
      'WD-3.4.4'
    ])
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

  await db.deleteFrom('message').where('id', 'in', [1, 2, 3]).execute()
}
