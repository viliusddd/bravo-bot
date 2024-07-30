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

const createPraises = createFor(db, 'praise')

afterEach(async () => {
  await db.deleteFrom('praise').execute()
})

afterAll(() => db.destroy())

describe('GET', () => {
  it('should return an empty array when there are no praises', async () => {
    const {body} = await supertest(app).get('/praises').expect(200)

    expect(body).toEqual([])
  })

  it('should return a list of existing praises', async () => {
    await createPraises([
      fakePraise(),

      fakePraise({
        praiseStr: 'You did really well 1!'
      })
    ])

    const {body} = await supertest(app).get('/praises').expect(200)

    expect(body).toEqual([
      praiseMatcher(),
      praiseMatcher({
        praiseStr: 'You did really well 1!'
      })
    ])
  })
})

describe('GET /:id', () => {
  it('should return 404 if praise does not exist', async () => {
    const {body} = await supertest(app).get('/praises/2912').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('should return an praise if it exists', async () => {
    await createPraises([
      fakePraise({
        id: 1371
      })
    ])

    const {body} = await supertest(app).get('/praises/1371').expect(200)

    expect(body).toEqual(
      praiseMatcher({
        id: 1371
      })
    )
  })
})

describe('POST', () => {
  it('should return 400 if praiseStr is missing', async () => {
    const {body} = await supertest(app)
      .post('/praises')
      .send(omit(['praiseStr'], fakePraise({})))
      .expect(400)

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
