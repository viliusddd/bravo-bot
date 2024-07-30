import createTestDatabase from '@tests/utils/createTestDatabase'
import {createFor, selectAllFor} from '@tests/utils/records'
import buildRepository from '../repository'
import {fakeEmoji, emojiMatcher} from './utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createEmojis = createFor(db, 'emoji')
const selectEmojis = selectAllFor(db, 'emoji')

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('emoji').execute()
})

describe('create', () => {
  it('should create a emoji (explicitly listing all fields)', async () => {
    const emoji = await repository.create({
      emojiStr: '🥳'
    })

    expect(emoji).toEqual({
      id: expect.any(Number),
      emojiStr: '🥳'
    })

    const emojisInDatabase = await selectEmojis()
    expect(emojisInDatabase).toEqual([emoji])
  })

  it('should create an emoji (with fake data functions)', async () => {
    const emoji = await repository.create(fakeEmoji())

    expect(emoji).toEqual(emojiMatcher())

    const emojisInDatabase = await selectEmojis()
    expect(emojisInDatabase).toEqual([emoji])
  })
})

describe('findAll', () => {
  it('should return all emojis', async () => {
    await createEmojis([
      fakeEmoji({
        emojiStr: '🥳'
      }),
      fakeEmoji({
        emojiStr: '🥳🥳'
      })
    ])

    const emojis = await repository.findAll()

    expect(emojis).toHaveLength(2)
    expect(emojis[0]).toEqual(emojiMatcher({emojiStr: '🥳'}))
    expect(emojis[1]).toEqual(emojiMatcher({emojiStr: '🥳🥳'}))
  })
})

describe('findById', () => {
  it('should return an emoji by id', async () => {
    const [emoji] = await createEmojis(
      fakeEmoji({
        id: 1371
      })
    )

    const foundEmoji = await repository.findById(emoji!.id)

    expect(foundEmoji).toEqual(emojiMatcher())
  })

  it('should return undefined if emoji is not found', async () => {
    const foundEmoji = await repository.findById(999999)

    expect(foundEmoji).toBeUndefined()
  })
})

describe('update', () => {
  it('should update an emoji', async () => {
    const [emoji] = await createEmojis(fakeEmoji())

    const updatedEmoji = await repository.update(emoji.id, {
      emojiStr: '🥳'
    })

    expect(updatedEmoji).toMatchObject(
      emojiMatcher({
        emojiStr: '🥳'
      })
    )
  })

  it('should return the original emoji if no changes are made', async () => {
    const [emoji] = await createEmojis(fakeEmoji())

    const updatedEmoji = await repository.update(emoji.id, {})

    expect(updatedEmoji).toMatchObject(emojiMatcher())
  })

  it('should return undefined if emoji is not found', async () => {
    const updatedEmoji = await repository.update(999, {
      emojiStr: '🥳🥳'
    })

    expect(updatedEmoji).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove an emoji', async () => {
    const [emoji] = await createEmojis(fakeEmoji())

    const removedEmoji = await repository.remove(emoji.id)

    expect(removedEmoji).toEqual(emojiMatcher())
  })

  it('should return undefined if emoji is not found', async () => {
    const removedEmoji = await repository.remove(999)

    expect(removedEmoji).toBeUndefined()
  })
})
