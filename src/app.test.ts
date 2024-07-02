import 'dotenv/config'
import supertest from 'supertest'
import createApp from './app'
import createDB from './database'

const db = createDB(process.env.DATABASE_URL)
const app = createApp(db)

const {DATABASE_URL} = process.env
if (!DATABASE_URL) throw new Error('Provide DATABASE_URL in your env variable.')

describe('GET /messages', () => {
  it('should respond with a 200 status code', async () => {
    const response = await supertest(app).get('/messages')
    expect(response.statusCode).toBe(200)
  })
})
