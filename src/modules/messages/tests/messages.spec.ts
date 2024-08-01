import 'dotenv/config'
import {createFor} from '@tests/utils/records'
import createTestDatabase from '@tests/utils/createTestDatabase'
import supertest from 'supertest'
import {apiMessageMatcher, fakeMessage, messageMatcher} from './utils'
import {fakeEmoji} from '@/modules/emojis/tests/utils'
import {fakePraise} from '@/modules/praises/tests/utils'
import {fakeSprint} from '@/modules/sprints/tests/utils'
import {fakeTemplate} from '@/modules/templates/tests/utils'
import {fakeUser} from '@/modules/users/tests/utils'
import '@/services/mocks/discordMock'
import BotClient from '@/services/discord'
import createApp from '@/app'

const bot = new BotClient(
  process.env.DISCORD_CHANNEL_ID,
  process.env.DISCORD_SERVER_ID,
  process.env.DISCORD_TOKEN
)
const db = await createTestDatabase()
const app = createApp(db, bot)

const createEmojis = createFor(db, 'emoji')
const createMessages = createFor(db, 'message')
const createPraises = createFor(db, 'praise')
const createSprints = createFor(db, 'sprint')
const createTemplates = createFor(db, 'template')
const createUsers = createFor(db, 'user')

afterEach(async () => {
  await db.deleteFrom('message').execute()
  await db.deleteFrom('sprint').execute()
  await db.deleteFrom('user').execute()
})

afterAll(() => db.destroy())

describe('GET', () => {
  it('should return an empty array when there are no messages', async () => {
    const {body} = await supertest(app).get('/messages').expect(200)

    expect(body).toEqual([])
  })

  it('should return a list of existing messages', async () => {
    const users = await createUsers(fakeUser())
    const sprints = await createSprints(fakeSprint())
    const bodyOverride = {userId: users[0].id, sprintId: sprints[0].id}

    await createMessages([
      fakeMessage(bodyOverride),

      fakeMessage({...bodyOverride, messageStr: 'You did really well !!'})
    ])

    const {body} = await supertest(app).get('/messages').expect(200)

    expect(body).toEqual([
      messageMatcher(),
      messageMatcher({
        messageStr: 'You did really well !!'
      })
    ])
  })
})

describe('GET /:id', () => {
  it('should return 404 if message does not exist', async () => {
    const {body} = await supertest(app).get('/messages/2912').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('should return an message if it exists', async () => {
    const users = await createUsers(fakeUser())
    const sprints = await createSprints(fakeSprint())
    const bodyOverride = {
      id: 1371,
      userId: users[0].id,
      sprintId: sprints[0].id
    }

    await createMessages([fakeMessage(bodyOverride)])

    const {body} = await supertest(app).get('/messages/1371').expect(200)

    expect(body).toEqual(messageMatcher(bodyOverride))
  })
})

describe('POST', () => {
  it('should return 400 if username is missing', async () => {
    const sprints = await createSprints(fakeSprint())

    const {body} = await supertest(app)
      .post('/messages')
      .send({sprintCode: sprints[0].sprintCode})
      .expect(400)

    expect(body.error.message).toMatch(/message/i)
  })

  it('should return 400 if sprintCode is missing', async () => {
    const users = await createUsers(fakeUser())

    const {body} = await supertest(app)
      .post('/messages')
      .send({username: users[0].username})
      .expect(400)

    expect(body.error.message).toMatch(/message/i)
  })

  it('does not allow to create a message with empty username', async () => {
    const sprints = await createSprints(fakeSprint())
    const {body} = await supertest(app)
      .post('/messages')
      .send({
        username: '',
        sprintCode: sprints[0].sprintCode
      })
      .expect(400)

    expect(body.error.message).toMatch(/message/i)
  })

  it('should return 201 and created message record', async () => {
    await createEmojis(fakeEmoji())
    await createTemplates(fakeTemplate())
    await createPraises(fakePraise())
    const users = await createUsers(fakeUser())
    const sprints = await createSprints(fakeSprint())

    const {body} = await supertest(app)
      .post('/messages')
      .send({
        username: users[0].username,
        sprintCode: sprints[0].sprintCode
      })
      .expect(201)

    expect(body).toEqual(apiMessageMatcher())
  })
})

describe('DELETE', () => {
  it('returns 404 if message does not exist', async () => {
    const {body} = await supertest(app).delete('/messages/12345678').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('returns 204 on successfull deletion', async () => {
    const users = await createUsers(fakeUser())
    const sprints = await createSprints(fakeSprint())

    await createMessages([
      fakeMessage({id: 123, userId: users[0].id, sprintId: sprints[0].id})
    ])

    await supertest(app).delete('/messages/123').expect(204)
  })

  it('returns no body content on success', async () => {
    const users = await createUsers(fakeUser())
    const sprints = await createSprints(fakeSprint())

    await createMessages([
      fakeMessage({id: 123, userId: users[0].id, sprintId: sprints[0].id})
    ])

    const record = await supertest(app).delete('/messages/123')
    expect(record.body).toEqual({})
  })
})
