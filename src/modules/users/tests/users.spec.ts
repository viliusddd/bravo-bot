import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import {createFor} from '@tests/utils/records'
import {omit} from 'lodash/fp'
import {fakeUser, userMatcher} from './utils'
import createApp from '@/app'
import BotClient from '@/services/discord'

const bot = new BotClient(
  process.env.DISCORD_CHANNEL_ID,
  process.env.DISCORD_SERVER_ID,
  process.env.DISCORD_TOKEN
)
const db = await createTestDatabase()
const app = createApp(db, bot)

const createUsers = createFor(db, 'user')

afterEach(async () => {
  await db.deleteFrom('user').execute()
})

afterAll(() => db.destroy())

describe('GET', () => {
  it('should return an empty array when there are no users', async () => {
    const {body} = await supertest(app).get('/users').expect(200)

    expect(body).toEqual([])
  })

  it('should return a list of existing users', async () => {
    await createUsers([
      fakeUser(),

      fakeUser({
        username: 'augriga'
      })
    ])

    const {body} = await supertest(app).get('/users').expect(200)

    expect(body).toEqual([
      userMatcher(),
      userMatcher({
        username: 'augriga'
      })
    ])
  })
})

describe('GET /:id', () => {
  it('should return 404 if user does not exist', async () => {
    const {body} = await supertest(app).get('/users/2912').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('should return an user if it exists', async () => {
    await createUsers([
      fakeUser({
        id: 1371
      })
    ])

    const {body} = await supertest(app).get('/users/1371').expect(200)

    expect(body).toEqual(
      userMatcher({
        id: 1371
      })
    )
  })
})

describe('POST', () => {
  it('should return 400 if username is missing', async () => {
    const {body} = await supertest(app)
      .post('/users')
      .send(omit(['username'], fakeUser({})))
      .expect(400)

    expect(body.error.message).toMatch(/username/i)
  })

  it('does not allow to create a user with empty username', async () => {
    const {body} = await supertest(app)
      .post('/users')
      .send(fakeUser({username: ''}))
      .expect(400)

    expect(body.error.message).toMatch(/username/i)
  })

  it('should return 201 and created user record', async () => {
    const {body} = await supertest(app)
      .post('/users')
      .send(fakeUser())
      .expect(201)

    expect(body).toEqual(userMatcher())
  })
})

describe('PATCH /:id', () => {
  it('returns 404 if user does not exist', async () => {
    const {body} = await supertest(app)
      .patch('/users/123456')
      .send(fakeUser())
      .expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('allows partial updates', async () => {
    const id = 137234
    await createUsers([
      fakeUser({
        id
      })
    ])

    const {body} = await supertest(app)
      .patch(`/users/${137234}`)
      .send({username: 'vjuodz'})
      .expect(200)

    expect(body).toEqual(
      userMatcher({
        id,
        username: 'vjuodz'
      })
    )
  })

  it('persists changes', async () => {
    const id = 41512
    await createUsers([fakeUser({id})])

    await supertest(app)
      .patch(`/users/${id}`)
      .send({username: 'vjuodz'})
      .expect(200)

    const {body} = await supertest(app).get('/users/41512').expect(200)

    expect(body).toEqual(
      userMatcher({
        username: 'vjuodz'
      })
    )
  })
})

describe('DELETE', () => {
  it('returns 404 if user does not exist', async () => {
    const {body} = await supertest(app).delete('/users/123456').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('returns 204 on successfull deletion', async () => {
    const id = 123
    await createUsers([fakeUser({id})])

    await supertest(app).delete('/users/123').expect(204)
  })

  it('returns no body content on success', async () => {
    const id = 123
    await createUsers([fakeUser({id})])

    const record = await supertest(app).delete('/users/123')
    expect(record.body).toEqual({})
  })
})
