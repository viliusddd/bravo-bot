import createTestDatabase from '@tests/utils/createTestDatabase'
import {createFor} from '@tests/utils/records'
import {createRec, templMsg} from '../service'
import BotClient from '@/services/discord'
import {fakeEmoji} from '@/modules/emojis/tests/utils'
import {fakePraise} from '@/modules/praises/tests/utils'
import {fakeSprint} from '@/modules/sprints/tests/utils'
import {fakeTemplate} from '@/modules/templates/tests/utils'
import {fakeUser} from '@/modules/users/tests/utils'
import {apiMessageMatcher} from './utils'

const db = await createTestDatabase()
const bot = new BotClient(
  process.env.DISCORD_CHANNEL_ID,
  process.env.DISCORD_GUILD_ID,
  process.env.DISCORD_TOKEN
)

// builds helper function to create messages
const createEmojis = createFor(db, 'emoji')
const createPraises = createFor(db, 'praise')
const createSprints = createFor(db, 'sprint')
const createTemplates = createFor(db, 'template')
const createUsers = createFor(db, 'user')

it('should create new message record and return the row values of new entry in database', async () => {
  // create side entries in db
  await createEmojis(fakeEmoji())
  await createTemplates(fakeTemplate())
  await createPraises(fakePraise())
  const users = await createUsers(fakeUser())
  const sprints = await createSprints(fakeSprint())

  // create message record
  const body = {username: users[0].username, sprintCode: sprints[0].sprintCode}
  const record = await createRec(db, body.username, body.sprintCode, bot)

  // ASSERT
  expect(record).toEqual(apiMessageMatcher())
})

it('shoud replace values inside template', () => {
  const template =
    'Awesome work, {username}, on finishing  {sprint_title}! {praise_str} {emoji_str}'
  const keys = {
    username: 'vjuodz',
    sprintTitle: 'Learning Your First Framework - Vue.js',
    emojiStr: '🥂',
    praiseStr:
      'This impressive achievement has paid off your hard work and dedication. Congrats!'
  }

  const result = templMsg(template, keys)

  expect(result).toEqual(
    'Awesome work, vjuodz, on finishing  Learning Your First Framework - Vue.js! This impressive achievement has paid off your hard work and dedication. Congrats! 🥂'
  )
})
