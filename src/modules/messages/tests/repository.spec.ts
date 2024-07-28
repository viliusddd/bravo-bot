import createTestDatabase from '@tests/utils/createTestDatabase'
import {createFor, selectAllFor} from '@tests/utils/records'
import buildRepository from '../repository'
import {fakeMessage, messageMatcher} from './utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createMessages = createFor(db, 'message')
const selectMessages = selectAllFor(db, 'message')

afterAll(() => db.destroy())

afterEach(async () => {
  // clearing the tested table after each test
  await db.deleteFrom('message').execute()
})

describe('create', () => {
  it('should create a message (explicitly listing all fields)', async () => {
    // ACT (When we call...)
    const message = await repository.create({
      messageStr: 'Job well done!'
    })

    // ASSERT (Then we should get...)
    // checking the returned message
    expect(message).toEqual({
      // any number is fine, we might want to check that it is an integer
      // but this is good enough to drive our development
      id: expect.any(Number),
      messageStr: 'Job well done!'
    })

    // checking directly in the database
    const messagesInDatabase = await selectMessages()
    expect(messagesInDatabase).toEqual([message])
  })

  it('should create an message (with fake data functions)', async () => {
    // same as the test above, but using fake data functions
    // ACT (When we call...)
    const message = await repository.create(fakeMessage())

    // ASSERT (Then we should get...)
    expect(message).toEqual(messageMatcher())

    // checking directly in the database
    const messagesInDatabase = await selectMessages()
    expect(messagesInDatabase).toEqual([message])
  })
})

describe('findAll', () => {
  it('should return all messages', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    await createMessages([
      fakeMessage({
        messageStr: 'Job well done!'
      }),
      fakeMessage({
        messageStr: 'Job very well done!'
      })
    ])

    // ACT (When we call...)
    const messages = await repository.findAll()

    // ASSERT (Then we should get...)
    expect(messages).toHaveLength(2)
    expect(messages[0]).toEqual(messageMatcher({messageStr: 'Job well done!'}))
    expect(messages[1]).toEqual(
      messageMatcher({messageStr: 'Job very well done!'})
    )
  })
})

describe('findById', () => {
  it('should return an message by id', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    const [message] = await createMessages(
      fakeMessage({
        id: 1371
      })
    )

    // ACT (When we call...)
    const foundMessage = await repository.findById(message!.id)

    // ASSERT (Then we should get...)
    expect(foundMessage).toEqual(messageMatcher())
  })

  it('should return undefined if message is not found', async () => {
    // ACT (When we call...)
    const foundMessage = await repository.findById(999999)

    // ASSERT (Then we should get...)
    expect(foundMessage).toBeUndefined()
  })
})

describe('update', () => {
  it('should update an message', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [message] = await createMessages(fakeMessage())

    // ACT (When we call...)
    const updatedMessage = await repository.update(message.id, {
      messageStr: 'Updated message'
    })

    // ASSERT (Then we should get...)
    expect(updatedMessage).toMatchObject(
      messageMatcher({
        messageStr: 'Updated message'
      })
    )
  })

  it('should return the original message if no changes are made', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [message] = await createMessages(fakeMessage())

    // ACT (When we call...)
    const updatedMessage = await repository.update(message.id, {})

    // ASSERT (Then we should get...)
    expect(updatedMessage).toMatchObject(messageMatcher())
  })

  it('should return undefined if message is not found', async () => {
    // ACT (When we call...)
    const updatedMessage = await repository.update(999, {
      messageStr: 'Updated message string!'
    })

    // We could also opt for throwing an error here, but this is a design decision

    // ASSERT (Then we should get...)
    expect(updatedMessage).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove an message', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [message] = await createMessages(fakeMessage())

    // ACT (When we call...)
    const removedMessage = await repository.remove(message.id)

    // ASSERT (Then we should get...)
    expect(removedMessage).toEqual(messageMatcher())
  })

  it('should return undefined if message is not found', async () => {
    // ACT (When we call...)
    const removedMessage = await repository.remove(999)

    // We could also opt for throwing an error here
    // but we decided to return undefined
    expect(removedMessage).toBeUndefined()
  })
})
