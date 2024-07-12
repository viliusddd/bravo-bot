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
  // clearing the tested table after each test
  await db.deleteFrom('emoji').execute()
})

describe('create', () => {
  it('should create a emoji (explicitly listing all fields)', async () => {
    // ACT (When we call...)
    const emoji = await repository.create({
      emojiStr: '🥳'
    })

    // ASSERT (Then we should get...)
    // checking the returned emoji
    expect(emoji).toEqual({
      // any number is fine, we might want to check that it is an integer
      // but this is good enough to drive our development
      id: expect.any(Number),
      emojiStr: '🥳'
    })

    // checking directly in the database
    const emojisInDatabase = await selectEmojis()
    expect(emojisInDatabase).toEqual([emoji])
  })

  it('should create an emoji (with fake data functions)', async () => {
    // same as the test above, but using fake data functions
    // ACT (When we call...)
    const emoji = await repository.create(fakeEmoji())

    // ASSERT (Then we should get...)
    expect(emoji).toEqual(emojiMatcher())

    // checking directly in the database
    const emojisInDatabase = await selectEmojis()
    expect(emojisInDatabase).toEqual([emoji])
  })
})

describe('findAll', () => {
  it('should return all emojis', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    await createEmojis([
      fakeEmoji({
        emojiStr: '🥳'
      }),
      fakeEmoji({
        emojiStr: '🥳🥳'
      })
    ])

    // ACT (When we call...)
    const emojis = await repository.findAll()

    // ASSERT (Then we should get...)
    expect(emojis).toHaveLength(2)
    expect(emojis[0]).toEqual(emojiMatcher({emojiStr: '🥳'}))
    expect(emojis[1]).toEqual(emojiMatcher({emojiStr: '🥳🥳'}))
  })
})

describe('findById', () => {
  it('should return an emoji by id', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    const [emoji] = await createEmojis(
      fakeEmoji({
        id: 1371
      })
    )

    // ACT (When we call...)
    const foundEmoji = await repository.findById(emoji!.id)

    // ASSERT (Then we should get...)
    expect(foundEmoji).toEqual(emojiMatcher())
  })

  it('should return undefined if emoji is not found', async () => {
    // ACT (When we call...)
    const foundEmoji = await repository.findById(999999)

    // ASSERT (Then we should get...)
    expect(foundEmoji).toBeUndefined()
  })
})

describe('update', () => {
  it('should update an emoji', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [emoji] = await createEmojis(fakeEmoji())

    // ACT (When we call...)
    const updatedEmoji = await repository.update(emoji.id, {
      emojiStr: '🥳'
    })

    // ASSERT (Then we should get...)
    expect(updatedEmoji).toMatchObject(
      emojiMatcher({
        emojiStr: '🥳'
      })
    )
  })

  it('should return the original emoji if no changes are made', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [emoji] = await createEmojis(fakeEmoji())

    // ACT (When we call...)
    const updatedEmoji = await repository.update(emoji.id, {})

    // ASSERT (Then we should get...)
    expect(updatedEmoji).toMatchObject(emojiMatcher())
  })

  it('should return undefined if emoji is not found', async () => {
    // ACT (When we call...)
    const updatedEmoji = await repository.update(999, {
      emojiStr: '🥳🥳'
    })

    // We could also opt for throwing an error here, but this is a design decision

    // ASSERT (Then we should get...)
    expect(updatedEmoji).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove an emoji', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [emoji] = await createEmojis(fakeEmoji())

    // ACT (When we call...)
    const removedEmoji = await repository.remove(emoji.id)

    // ASSERT (Then we should get...)
    expect(removedEmoji).toEqual(emojiMatcher())
  })

  it('should return undefined if emoji is not found', async () => {
    // ACT (When we call...)
    const removedEmoji = await repository.remove(999)

    // We could also opt for throwing an error here
    // but we decided to return undefined
    expect(removedEmoji).toBeUndefined()
  })
})
