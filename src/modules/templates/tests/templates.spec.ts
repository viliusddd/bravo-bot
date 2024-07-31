import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import {createFor} from '@tests/utils/records'
import {omit} from 'lodash/fp'
import {fakeTemplate, templateMatcher} from './utils'
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

const createTemplates = createFor(db, 'template')

afterEach(async () => {
  await db.deleteFrom('template').execute()
})

afterAll(() => db.destroy())

describe('GET', () => {
  it('should return an empty array when there are no templates', async () => {
    const {body} = await supertest(app).get('/templates').expect(200)

    expect(body).toEqual([])
  })

  it('should return a list of existing templates', async () => {
    await createTemplates([
      fakeTemplate(),

      fakeTemplate({
        templateStr:
          '{username} has achieved {sprint_title}! {praise_str} {emoji_str} 2'
      })
    ])

    const {body} = await supertest(app).get('/templates').expect(200)

    expect(body).toEqual([
      templateMatcher(),
      templateMatcher({
        templateStr:
          '{username} has achieved {sprint_title}! {praise_str} {emoji_str} 2'
      })
    ])
  })
})

describe('GET /:id', () => {
  it('should return 404 if template does not exist', async () => {
    const {body} = await supertest(app).get('/templates/2912').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('should return an template if it exists', async () => {
    await createTemplates([
      fakeTemplate({
        id: 1371
      })
    ])

    const {body} = await supertest(app).get('/templates/1371').expect(200)

    expect(body).toEqual(
      templateMatcher({
        id: 1371
      })
    )
  })
})

describe('POST', () => {
  it('should return 400 if templateStr is missing', async () => {
    const {body} = await supertest(app)
      .post('/templates')
      .send(omit(['templateStr'], fakeTemplate({})))
      .expect(400)

    expect(body.error.message).toMatch(/templateStr/i)
  })

  it('does not allow to create a template with empty templateStr', async () => {
    const {body} = await supertest(app)
      .post('/templates')
      .send(fakeTemplate({templateStr: ''}))
      .expect(400)

    expect(body.error.message).toMatch(/templateStr/i)
  })

  it('should return 201 and created template record', async () => {
    const {body} = await supertest(app)
      .post('/templates')
      .send(
        fakeTemplate({
          templateStr:
            '{username} has achieved {sprint_title}! {praise_str} {emoji_str}'
        })
      )
      .expect(201)

    expect(body).toEqual(templateMatcher())
  })
})

describe('PATCH /:id', () => {
  it('returns 404 if template does not exist', async () => {
    const {body} = await supertest(app)
      .patch('/templates/123456')
      .send(fakeTemplate())
      .expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('allows partial updates', async () => {
    const id = 137234
    await createTemplates([
      fakeTemplate({
        id
      })
    ])

    const {body} = await supertest(app)
      .patch(`/templates/${137234}`)
      .send({
        templateStr:
          '{username} has achieved {sprint_title}! {praise_str} {emoji_str}'
      })
      .expect(200)

    expect(body).toEqual(
      templateMatcher({
        id,
        templateStr:
          '{username} has achieved {sprint_title}! {praise_str} {emoji_str}'
      })
    )
  })

  it('persists changes', async () => {
    const id = 41512
    await createTemplates([fakeTemplate({id})])

    await supertest(app)
      .patch(`/templates/${id}`)
      .send({
        templateStr:
          '{username} has achieved {sprint_title}! {praise_str} {emoji_str}'
      })
      .expect(200)

    const {body} = await supertest(app).get('/templates/41512').expect(200)

    expect(body).toEqual(
      templateMatcher({
        templateStr:
          '{username} has achieved {sprint_title}! {praise_str} {emoji_str}'
      })
    )
  })
})

describe('DELETE', () => {
  it('returns 404 if template does not exist', async () => {
    const {body} = await supertest(app).delete('/templates/123456').expect(404)

    expect(body.error.message).toMatch(/not found/i)
  })

  it('returns 200 on successfull deletion', async () => {
    const id = 123
    await createTemplates([fakeTemplate({id})])

    await supertest(app).delete('/templates/123').expect(204)
  })

  it('returns no body content on success', async () => {
    const id = 123
    await createTemplates([fakeTemplate({id})])

    const record = await supertest(app).delete('/templates/123')
    expect(record.body).toEqual({})
  })
})
