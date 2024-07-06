import {type Kysely} from 'kysely'

type QueryReturn = Array<{[x: string]: string}>

export async function up(db: Kysely<any>) {
  const users: QueryReturn = await db
    .insertInto('users')
    .values([
      {username: 'vjuodz'},
      {username: 'ddidzi'},
      {username: 'rbeniu'},
      {username: 'augriga'},
      {username: 'jiylee'}
    ])
    .returningAll()
    .execute()

  const sprints: QueryReturn = await db
    .insertInto('sprints')
    .values([
      {id: 'WD.1.1.5', title: 'First Steps Into Programming with Python'},
      {id: 'WD.1.2.5', title: 'Intermediate Programming with Python'},
      {id: 'WD.1.3.4', title: 'Object Oriented Programming'},
      {id: 'WD.1.4.4', title: 'Computer Science Fundamentals'},
      {id: 'WD.2.1.5', title: 'HTML and CSS - the Foundation of Web Pages'},
      {id: 'WD.2.2.5', title: 'Improving Websites with Javascript'},
      {id: 'WD.2.3.5', title: 'Learning Your First Framework - Vue.js'},
      {id: 'WD.2.4.5', title: 'Typing and Testing JavaScript'},
      {id: 'WD.3.1.5', title: 'Node.js and Relational Databases'},
      {id: 'WD.3.2.5', title: 'REST APIs & Test Driven Development'},
      {id: 'WD.3.3.5', title: 'Full-stack Fundamentals'},
      {id: 'WD.3.4.4', title: 'Containers and CI/CD'}
    ])
    .returningAll()
    .execute()

  const praises: QueryReturn = await db
    .insertInto('praises')
    .values([
      {
        praise:
          "You've accomplished something truly amazing! Congratulations on your achievement!"
      },
      {
        praise:
          'You should be so proud of yourself for all of the hard work you put in to reach your goal. Congrats!'
      },
      {
        praise:
          'Your determination and perseverance have paid off in a big way. Congratulations on your success!'
      },
      {
        praise:
          "Congratulations on reaching such a significant milestone. You've earned every bit of recognition coming your way."
      },
      {
        praise:
          'Your achievement is a testament to your talent, passion, and hard work. Keep up the great work!'
      },
      {
        praise:
          "I'm so impressed by your dedication and commitment to achieving your goal. Congratulations on your accomplishment!"
      },
      {
        praise:
          'You are an inspiration to us all with your incredible achievement. Congratulations and keep reaching for the stars!'
      },
      {
        praise:
          'You have set the bar high for all of us with your amazing accomplishment. Congratulations on your success!'
      },
      {
        praise:
          'This impressive achievement has paid off your hard work and dedication. Congrats!'
      },
      {
        praise:
          'You are proof that anything is possible with hard work, determination, and perseverance. Congratulations on your achievement!'
      }
    ])
    .returningAll()
    .execute()

  const templates: QueryReturn = await db
    .insertInto('templates')
    .values([
      {template: '{user} has just completed {sprint}!\n{message}{emoji}'},
      {
        template:
          '{user} has successfully completed {sprint}!\n{message}{emoji}'
      },
      {
        template:
          'Big congratulations to {user} for finishing {sprint}\n{message}{emoji}!'
      },
      {template: '{user} has nailed {sprint}}!\n{message}{emoji}'},
      {template: 'Kudos to {user} for completing {sprint}!\n{message}{emoji}'},
      {template: 'Great job {user} on wrapping up {sprint}!\n{message}{emoji}'},
      {
        template: 'Hats off to {user} for finishing {sprint}!\n{message}{emoji}'
      },
      {template: '{user} has just conquered {sprint}!\n{message}{emoji}'},
      {template: 'Well done {user} for completing {sprint}!\n{message}{emoji}'},
      {
        template:
          'Awesome work, {user}, on finishing  {sprint}!\n{message}{emoji}'
      },
      {template: '{user} has achieved {sprint}!\n{message}{emoji}'}
    ])
    .returningAll()
    .execute()

  await db
    .insertInto('messages')
    .values([
      {
        user_id: users[0].id,
        sprint_id: sprints[1].id,
        praise_id: praises[2].id,
        template_id: templates[3].id
      },
      {
        user_id: users[1].id,
        sprint_id: sprints[2].id,
        praise_id: praises[3].id,
        template_id: templates[4].id
      },
      {
        user_id: users[2].id,
        sprint_id: sprints[3].id,
        praise_id: praises[4].id,
        template_id: templates[5].id
      }
    ])
    .returningAll()
    .execute()
}

export async function down(db: Kysely<any>) {
  await db
    .deleteFrom('users')
    .where('username', 'in', [
      'vjuodz',
      'ddidzi',
      'rbeniu',
      'augriga',
      'jiylee'
    ])
    .execute()

  await db
    .deleteFrom('sprints')
    .where('id', 'in', [
      'WD.1.1.5',
      'WD.1.2.5',
      'WD.1.3.4',
      'WD.1.4.4',
      'WD.2.1.5',
      'WD.2.2.5',
      'WD.2.3.5',
      'WD.2.4.5',
      'WD.3.1.5',
      'WD.3.2.5',
      'WD.3.3.5',
      'WD.3.4.4'
    ])
    .execute()

  await db
    .deleteFrom('praises')
    .where('id', 'in', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .execute()

  await db
    .deleteFrom('templates')
    .where('id', 'in', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .execute()

  await db.deleteFrom('messages').where('id', 'in', [1, 2, 3]).execute()
}
