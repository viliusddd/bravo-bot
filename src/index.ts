import 'dotenv/config'
import createApp from './app'
import createDB from './database'
import BotClient from './utils/bot'

const bot = new BotClient(
  process.env.DISCORD_CHANNEL_ID,
  process.env.DISCORD_TOKEN
)
bot.start()
bot.sendMessage('from index.ts')

const {DATABASE_URL, PORT} = process.env

if (!DATABASE_URL) throw new Error('Provide DATABASE_URL in your env variable.')
if (!PORT) throw new Error('Provide PORT in your env variable.')

const db = createDB(DATABASE_URL)

const app = createApp(db, bot)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
