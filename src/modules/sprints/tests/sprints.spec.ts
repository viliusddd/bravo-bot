import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import {createFor} from '@tests/utils/records'
import {omit} from 'lodash/fp'
import {fakeSprint, sprintMatcher} from './utils'
import createApp from '@/app'
import BotClient from '@/services/discord'

const bot = new BotClient(
  process.env.DISCORD_CHANNEL_ID,
  process.env.DISCORD_GUILD_ID,
  process.env.DISCORD_TOKEN
)
const db = await createTestDatabase()
const app = createApp(db, bot)

// builds helper function to create sprints
const createSprints = createFor(db, 'sprint')

afterEach(async () => {
  // clearing the tested table after each test
  await db.deleteFrom('sprint').execute()
})

// close the database connection after all tests
// For SQLite, this is not necessary, but for other databases, it is.
afterAll(() => db.destroy())

// This is not called "contoller.spec.ts" because we are specifying what this
// entire module should do, not just the controller.

// This could be moved to root-level tests folder, however, nearly always
// breaking tests here means issues in the sprints module, so we are colocating
// it with the module.
describe('GET', () => {
  it('should return an empty array when there are no sprints', async () => {
    // ACT (When we request...)
    const {body} = await supertest(app).get('/sprints').expect(200)

    // ASSERT (Then we should get...)
    expect(body).toEqual([])
  })

  it('should return a list of existing sprints', async () => {
    // ARRANGE (Given that we have...)
    await createSprints([
      // we have a function that spits out a generic fake sprint
      fakeSprint(),

      // we generate a slightly different sprint
      // in this function call we provide what should
      // be different from the our default generic sprint
      fakeSprint({
        sprintCode: 'WD-2.1.5',
        sprintTitle: 'HTML and CSS - the Foundation of Web Pages'
      })
    ])

    // ACT (When we request...)
    const {body} = await supertest(app).get('/sprints').expect(200)

    // ASSERT (Then we should get...)
    expect(body).toEqual([
      sprintMatcher(),
      sprintMatcher({
        sprintCode: 'WD-2.1.5',
        sprintTitle: 'HTML and CSS - the Foundation of Web Pages'
      })
    ])

    // This is same as:
    // expect(body).toEqual([
    //   {
    //     id: expect.any(Number), // we do not care about the exact id
    //     sprintTitle: 'First Steps Into Programming with Python', // our default sprintTitle, sprintCode generated by fakeSprint
    //     sprintCode: 'WD-1.1.5',
    //   },
    //   {
    //     id: expect.any(Number),
    //     sprintTitle: 'Title 2', // our custom sprintTitle
    //     sprintCode: 'Other Content',
    //   },
    // ]);
  })
})

describe('GET /:id', () => {
  it('should return 404 if sprint does not exist', async () => {
    // ACT (When we request...)
    const {body} = await supertest(app).get('/sprints/2912').expect(404)

    // ASSERT (Then we should get...)
    // Some error message that contains "not found".
    // Instead of stating the exact error message, we use a
    // regular expression to draw slightly more flexible boundaries
    // around our expectations. If we wanted to slightly change
    // our error message in code, we would not want these tests to break,
    // as long as the error message still contains "not found" in some
    // form: "Sprint Not Found", "Not found", "Sprint was not found"...
    expect(body.error.message).toMatch(/not found/i)
  })

  it('should return an sprint if it exists', async () => {
    // ARRANGE (Given that we have...)
    await createSprints([
      fakeSprint({
        id: 1371
      })
    ])

    // ACT (When we request...)
    const {body} = await supertest(app).get('/sprints/1371').expect(200)

    // ASSERT (Then we should get...)
    expect(body).toEqual(
      sprintMatcher({
        id: 1371
      })
    )
  })
})

describe('POST', () => {
  it('should return 400 if sprintTitle is missing', async () => {
    // ACT (When we request...)
    const {body} = await supertest(app)
      .post('/sprints')
      .send(omit(['sprintTitle'], fakeSprint({})))
      .expect(400) // a cheeky convenient expectation inside of ACT

    // ASSERT (Then we should get...)
    expect(body.error.message).toMatch(/sprintTitle/i)
  })

  it('should return 400 if sprintCode is missing', async () => {
    // ACT (When we request...)
    const {body} = await supertest(app)
      .post('/sprints')
      .send(omit(['sprintCode'], fakeSprint({})))
      .expect(400)

    // ASSERT (Then we should get...)
    expect(body.error.message).toMatch(/sprintCode/i)
  })

  it('does not allow to create an sprint with an empty sprintTitle', async () => {
    // ACT (When we request...)
    const {body} = await supertest(app)
      .post('/sprints')
      .send(fakeSprint({sprintTitle: ''}))
      .expect(400)

    // ASSERT (Then we should get...)
    expect(body.error.message).toMatch(/sprintTitle/i)
  })

  it('does not allow to create an sprint with empty sprintCode', async () => {
    const {body} = await supertest(app)
      .post('/sprints')
      .send(fakeSprint({sprintCode: ''}))
      .expect(400)

    expect(body.error.message).toMatch(/sprintCode/i)
  })

  it('should return 201 and created sprint record', async () => {
    const {body} = await supertest(app)
      .post('/sprints')
      .send(fakeSprint())
      .expect(201)

    expect(body).toEqual(sprintMatcher())
  })
})

describe('PATCH /:id', () => {
  it('returns 404 if sprint does not exist', async () => {
    const {body} = await supertest(app)
      .patch('/sprints/123456')
      .send(fakeSprint())
      .expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('allows partial updates', async () => {
    const id = 137234
    await createSprints([
      fakeSprint({
        id
      })
    ])

    const {body} = await supertest(app)
      .patch(`/sprints/${137234}`)
      .send({sprintCode: 'WD-1.1.5'})
      .expect(200)

    expect(body).toEqual(
      sprintMatcher({
        id,
        sprintCode: 'WD-1.1.5'
      })
    )
  })

  it('persists changes', async () => {
    const id = 41512
    await createSprints([fakeSprint({id})])

    await supertest(app)
      .patch(`/sprints/${id}`)
      .send({
        sprintTitle: 'First Steps Into Programming with Python',
        sprintCode: 'WD-1.1.5'
      })
      .expect(200)

    const {body} = await supertest(app).get('/sprints/41512').expect(200)

    expect(body).toEqual(
      sprintMatcher({
        id,
        sprintTitle: 'First Steps Into Programming with Python',
        sprintCode: 'WD-1.1.5'
      })
    )
  })
})

describe('DELETE', () => {
  it('returns 404 if sprint does not exist', async () => {
    const {body} = await supertest(app).delete('/sprints/123456').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('returns 204 on successfull deletion', async () => {
    const id = 123
    await createSprints([fakeSprint({id})])

    await supertest(app).delete('/sprints/123').expect(204)
  })

  it('returns no body content on success', async () => {
    const id = 123
    await createSprints([fakeSprint({id})])

    const record = await supertest(app).delete('/sprints/123')
    expect(record.body).toEqual({})
  })
})
