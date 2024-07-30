import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import {createFor} from '@tests/utils/records'
import {omit} from 'lodash/fp'
import {fakePraise, praiseMatcher} from './utils'
import createApp from '@/app'
import BotClient from '@/services/discord'

const bot = new BotClient(
  process.env.DISCORD_CHANNEL_ID,
  process.env.DISCORD_GUILD_ID,
  process.env.DISCORD_TOKEN
)
const db = await createTestDatabase()
const app = createApp(db, bot)

// builds helper function to create praises
const createPraises = createFor(db, 'praise')

afterEach(async () => {
  // clearing the tested table after each test
  await db.deleteFrom('praise').execute()
})

// close the database connection after all tests
// For SQLite, this is not necessary, but for other databases, it is.
afterAll(() => db.destroy())

// This is not called "contoller.spec.ts" because we are specifying what this
// entire module should do, not just the controller.

// This could be moved to root-level tests folder, however, nearly always
// breaking tests here means issues in the praises module, so we are colocating
// it with the module.
describe('GET', () => {
  it('should return an empty array when there are no praises', async () => {
    // ACT (When we request...)
    const {body} = await supertest(app).get('/praises').expect(200)

    // ASSERT (Then we should get...)
    expect(body).toEqual([])
  })

  it('should return a list of existing praises', async () => {
    // ARRANGE (Given that we have...)
    await createPraises([
      // we have a function that spits out a generic fake praise
      fakePraise(),

      // we generate a slightly different praise
      // in this function call we provide what should
      // be different from the our default generic praise
      fakePraise({
        praiseStr: 'You did really well 1!'
      })
    ])

    // ACT (When we request...)
    const {body} = await supertest(app).get('/praises').expect(200)

    // ASSERT (Then we should get...)
    expect(body).toEqual([
      praiseMatcher(),
      praiseMatcher({
        praiseStr: 'You did really well 1!'
      })
    ])

    // This is same as:
    // expect(body).toEqual([
    //   {
    //     id: expect.any(Number), // we do not care about the exact id
    //     title: 'My Title', // our default title, content generated by fakePraise
    //     content: 'Some Content',
    //   },
    //   {
    //     id: expect.any(Number),
    //     title: 'Title 2', // our custom title
    //     content: 'Other Content',
    //   },
    // ]);
  })
})

describe('GET /:id', () => {
  it('should return 404 if praise does not exist', async () => {
    // ACT (When we request...)
    const {body} = await supertest(app).get('/praises/2912').expect(404)

    // ASSERT (Then we should get...)
    // Some error message that contains "not found".
    // Instead of stating the exact error message, we use a
    // regular expression to draw slightly more flexible boundaries
    // around our expectations. If we wanted to slightly change
    // our error message in code, we would not want these tests to break,
    // as long as the error message still contains "not found" in some
    // form: "PraiseNotFound", "Not found", "Praise was not found"...
    expect(body.error.message).toMatch(/not found/i)
  })

  it('should return an praise if it exists', async () => {
    // ARRANGE (Given that we have...)
    await createPraises([
      fakePraise({
        id: 1371
      })
    ])

    // ACT (When we request...)
    const {body} = await supertest(app).get('/praises/1371').expect(200)

    // ASSERT (Then we should get...)
    expect(body).toEqual(
      praiseMatcher({
        id: 1371
      })
    )
  })
})

describe('POST', () => {
  it('should return 400 if praiseStr is missing', async () => {
    // ACT (When we request...)
    const {body} = await supertest(app)
      .post('/praises')
      .send(omit(['praiseStr'], fakePraise({})))
      .expect(400)

    // ASSERT (Then we should get...)
    expect(body.error.message).toMatch(/praiseStr/i)
  })

  it('does not allow to create a praise with empty praiseStr', async () => {
    const {body} = await supertest(app)
      .post('/praises')
      .send(fakePraise({praiseStr: ''}))
      .expect(400)

    expect(body.error.message).toMatch(/praiseStr/i)
  })

  it('should return 201 and created praise record', async () => {
    const {body} = await supertest(app)
      .post('/praises')
      .send(fakePraise())
      .expect(201)

    expect(body).toEqual(praiseMatcher())
  })
})

describe('PATCH /:id', () => {
  it('returns 404 if praise does not exist', async () => {
    const {body} = await supertest(app)
      .patch('/praises/123456')
      .send(fakePraise())
      .expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('allows partial updates', async () => {
    const id = 137234
    await createPraises([
      fakePraise({
        id
      })
    ])

    const {body} = await supertest(app)
      .patch(`/praises/${137234}`)
      .send({praiseStr: 'Job well done!'})
      .expect(200)

    expect(body).toEqual(
      praiseMatcher({
        id,
        praiseStr: 'Job well done!'
      })
    )
  })

  it('persists changes', async () => {
    const id = 41512
    await createPraises([fakePraise({id})])

    await supertest(app)
      .patch(`/praises/${id}`)
      .send({praiseStr: 'Job well done!'})
      .expect(200)

    const {body} = await supertest(app).get('/praises/41512').expect(200)

    expect(body).toEqual(
      praiseMatcher({
        praiseStr: 'Job well done!'
      })
    )
  })
})

describe('DELETE', () => {
  it('returns 404 if praise does not exist', async () => {
    const {body} = await supertest(app).delete('/praises/123456').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('returns 204 on successfull deletion', async () => {
    const id = 123
    await createPraises([fakePraise({id})])

    await supertest(app).delete('/praises/123').expect(204)
  })

  it('returns no body content on success', async () => {
    const id = 123
    await createPraises([fakePraise({id})])

    const record = await supertest(app).delete('/praises/123')
    expect(record.body).toEqual({})
  })
})
