import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import {createFor} from '@tests/utils/records'
import {omit} from 'lodash/fp'
import {fakeSprint, sprintMatcher} from './utils'
import createApp from '@/app'
import '@/services/mocks/discordMock'
import BotClient from '@/services/discord'

const bot = new BotClient(
  process.env.DISCORD_CHANNEL_ID,
  process.env.DISCORD_SERVER_ID,
  process.env.DISCORD_TOKEN
)
const db = await createTestDatabase()
const app = createApp(db, bot)

const createSprints = createFor(db, 'sprint')

afterEach(async () => {
  await db.deleteFrom('sprint').execute()
})

afterAll(() => db.destroy())

describe('GET', () => {
  it('should return an empty array when there are no sprints', async () => {
    const {body} = await supertest(app).get('/sprints').expect(200)

    expect(body).toEqual([])
  })

  it('should return a list of existing sprints', async () => {
    await createSprints([
      fakeSprint(),

      fakeSprint({
        sprintCode: 'WD-2.1.5',
        sprintTitle: 'HTML and CSS - the Foundation of Web Pages'
      })
    ])

    const {body} = await supertest(app).get('/sprints').expect(200)

    expect(body).toEqual([
      sprintMatcher(),
      sprintMatcher({
        sprintCode: 'WD-2.1.5',
        sprintTitle: 'HTML and CSS - the Foundation of Web Pages'
      })
    ])
  })
})

describe('GET /:id', () => {
  it('should return 404 if sprint does not exist', async () => {
    const {body} = await supertest(app).get('/sprints/2912').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('should return an sprint if it exists', async () => {
    await createSprints([
      fakeSprint({
        id: 1371
      })
    ])

    const {body} = await supertest(app).get('/sprints/1371').expect(200)

    expect(body).toEqual(
      sprintMatcher({
        id: 1371
      })
    )
  })
})

describe('POST', () => {
  it('should return 400 if sprintTitle is missing', async () => {
    const {body} = await supertest(app)
      .post('/sprints')
      .send(omit(['sprintTitle'], fakeSprint({})))
      .expect(400) // a cheeky convenient expectation inside of ACT

    expect(body.error.message).toMatch(/sprintTitle/i)
  })

  it('should return 400 if sprintCode is missing', async () => {
    const {body} = await supertest(app)
      .post('/sprints')
      .send(omit(['sprintCode'], fakeSprint({})))
      .expect(400)

    expect(body.error.message).toMatch(/sprintCode/i)
  })

  it('does not allow to create an sprint with an empty sprintTitle', async () => {
    const {body} = await supertest(app)
      .post('/sprints')
      .send(fakeSprint({sprintTitle: ''}))
      .expect(400)

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
