import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import {createFor} from '@tests/utils/records'
import {omit} from 'lodash/fp'
import {fakeEmoji, emojiMatcher} from './utils'
import createApp from '@/app'
import '@/services/__mocks__/discordMock'
import BotClient from '@/services/discord'

const bot = new BotClient(
  process.env.DISCORD_CHANNEL_ID,
  process.env.DISCORD_SERVER_ID,
  process.env.DISCORD_TOKEN
)
const db = await createTestDatabase()
const app = createApp(db, bot)

const createEmojis = createFor(db, 'emoji')

afterEach(async () => {
  await db.deleteFrom('emoji').execute()
})

afterAll(() => db.destroy())

describe('GET', () => {
  it('should return an empty array when there are no emojis', async () => {
    const {body} = await supertest(app).get('/emojis').expect(200)

    expect(body).toEqual([])
  })

  it('should return a list of existing emojis', async () => {
    await createEmojis([
      fakeEmoji(),

      fakeEmoji({
        emojiStr: '🥳🥳🥳'
      })
    ])

    const {body} = await supertest(app).get('/emojis').expect(200)

    expect(body).toEqual([
      emojiMatcher(),
      emojiMatcher({
        emojiStr: '🥳🥳🥳'
      })
    ])
  })
})

describe('GET /:id', () => {
  it('should return 404 if emoji does not exist', async () => {
    const {body} = await supertest(app).get('/emojis/2912').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('should return an emoji if it exists', async () => {
    await createEmojis([
      fakeEmoji({
        id: 1371
      })
    ])

    const {body} = await supertest(app).get('/emojis/1371').expect(200)

    expect(body).toEqual(
      emojiMatcher({
        id: 1371
      })
    )
  })
})

describe('POST', () => {
  it('should return 400 if emojiStr is missing', async () => {
    const {body} = await supertest(app)
      .post('/emojis')
      .send(omit(['emojiStr'], fakeEmoji({})))
      .expect(400)

    expect(body.error.message).toMatch(/emojiStr/i)
  })

  it('does not allow to create a emoji with empty emojiStr', async () => {
    const {body} = await supertest(app)
      .post('/emojis')
      .send(fakeEmoji({emojiStr: ''}))
      .expect(400)

    expect(body.error.message).toMatch(/emojiStr/i)
  })

  it('should return 201 and created emoji record', async () => {
    const {body} = await supertest(app)
      .post('/emojis')
      .send(
        fakeEmoji({
          emojiStr: '🥳'
        })
      )
      .expect(201)

    expect(body).toEqual(emojiMatcher())
  })
})

describe('PATCH /:id', () => {
  it('returns 404 if emoji does not exist', async () => {
    const {body} = await supertest(app)
      .patch('/emojis/123456')
      .send(fakeEmoji())
      .expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('allows partial updates', async () => {
    const id = 137234
    await createEmojis([
      fakeEmoji({
        id
      })
    ])

    const {body} = await supertest(app)
      .patch(`/emojis/${137234}`)
      .send({
        emojiStr: '🥳'
      })
      .expect(200)

    expect(body).toEqual(
      emojiMatcher({
        id,
        emojiStr: '🥳'
      })
    )
  })

  it('persists changes', async () => {
    const id = 41512
    await createEmojis([fakeEmoji({id})])

    await supertest(app)
      .patch(`/emojis/${id}`)
      .send({
        emojiStr: '🥳'
      })
      .expect(200)

    const {body} = await supertest(app).get('/emojis/41512').expect(200)

    expect(body).toEqual(
      emojiMatcher({
        emojiStr: '🥳'
      })
    )
  })
})

describe('DELETE', () => {
  it('returns 404 if emoji does not exist', async () => {
    const {body} = await supertest(app).delete('/emojis/123456').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('returns 200 on successfull deletion', async () => {
    const id = 123
    await createEmojis([fakeEmoji({id})])

    await supertest(app).delete('/emojis/123').expect(204)
  })

  it('returns no body content on success', async () => {
    const id = 123
    await createEmojis([fakeEmoji({id})])

    const record = await supertest(app).delete('/emojis/123')
    expect(record.body).toEqual({})
  })
})
