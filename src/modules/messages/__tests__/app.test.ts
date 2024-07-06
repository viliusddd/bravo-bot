import 'dotenv/config'
import request from 'supertest'
import createApp from '@/app'
import createDB from '@/database'

const {DATABASE_URL} = process.env
if (!DATABASE_URL) throw new Error('Provide DATABASE_URL in your env variable.')

const db = createDB(DATABASE_URL)
const app = createApp(db)

describe('POST /messages', () => {
  it('should respond with a 200 status code', async () => {
    const response = await request(app).post('/messages').send({
      username: 'vjuodz',
      sprintCode: 'WD-2.3.5'
    })
    expect(response.statusCode).toBe(200)
  })
  it('shoud specify json in the content type header', async () => {
    const response = await request(app).post('/messages').send({
      username: 'vjuodz',
      sprintCode: 'WD-2.3.5'
    })
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    )
  })
  test('response has userId', async () => {
    const response = await request(app).post('/messages').send({
      username: 'vjuodz',
      sprintCode: 'WD-2.3.4'
    })
    expect(response.body.userId).toBeDefined()
  })
  it('should return a 400 code', async () => {
    const payload = {username: 'vjuodz', sprintCode: 'WD-2.3.5}'}

    const usernameResp = await request(app)
      .post('/messages')
      .send(payload.username)

    const sprintResp = await request(app)
      .post('/messages')
      .send(payload.sprintCode)

    expect(usernameResp.statusCode).toBe(400)
    expect(sprintResp.statusCode).toBe(400)
  })
})
