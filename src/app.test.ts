import 'dotenv/config'
import supertest from 'supertest'
import createApp from './app'
import createDB from './database'

const {DB_URL} = process.env
if (!DB_URL) throw new Error('Provide DB_URL in your env variable.')

const db = createDB(DB_URL)
const app = createApp(db)

describe('GET /messages', () => {
  it('should respond with a 200 status code', async () => {
    const response = await supertest(app).get('/messages')
    expect(response.statusCode).toBe(200)
  })
})
