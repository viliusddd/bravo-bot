import 'dotenv/config'
import createApp from './app'
import createDB from './database'

const {DB_URL, PORT} = process.env

if (!DB_URL) throw new Error('Provide DB_URL in your env variable.')

const db = createDB(DB_URL)
const app = createApp(db)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
