import createTestDatabase from '@tests/utils/createTestDatabase'
import {createFor, selectAllFor} from '@tests/utils/records'
import buildRepository from '../repository'
import buildUsersRepo from '@/modules/users/repository'
import buildSprintsRepo from '@/modules/sprints/repository'
import {fakeMessage, messageMatcher} from './utils'
import {fakeUser} from '@/modules/users/tests/utils'
import {fakeSprint} from '@/modules/sprints/tests/utils'

const db = await createTestDatabase()

const messagesRepo = buildRepository(db)
const usersRepo = buildUsersRepo(db)
const sprintsRepo = buildSprintsRepo(db)

const createMessages = createFor(db, 'message')
const selectMessages = selectAllFor(db, 'message')

afterAll(() => db.destroy())

afterEach(async () => {
  // clearing the tested table after each test
  await db.deleteFrom('message').execute()
  await db.deleteFrom('sprint').execute()
  await db.deleteFrom('user').execute()
})

describe('create', () => {
  it('should create a message (explicitly listing all fields)', async () => {
    // ACT (When we call...)
    const user = await usersRepo.create({username: 'vjuodz'})
    const sprint = await sprintsRepo.create({
      sprintCode: 'WD-1.2.3',
      sprintTitle: '🏃🏻📕'
    })
    const body = {userId: user!.id, sprintId: sprint!.id}
    const message = await messagesRepo.create({...body, messageStr: '🥳'})

    // ASSERT (Then we should get...)
    // checking the returned message
    expect(message).toEqual({
      // any number is fine, we might want to check that it is an integer
      // but this is good enough to drive our development
      id: expect.any(Number),
      ...body,
      messageStr: '🥳',
      createdOn: expect.any(String)
    })

    // checking directly in the database
    const messagesInDatabase = await selectMessages()
    expect(messagesInDatabase).toEqual([message])
  })

  it('should create an message (with fake data functions)', async () => {
    // same as the test above, but using fake data functions
    // ACT (When we call...)
    const user = await usersRepo.create(fakeUser())
    const sprint = await sprintsRepo.create(fakeSprint())
    const body = {userId: user!.id, sprintId: sprint!.id}
    const message = await messagesRepo.create(fakeMessage(body))
    // ASSERT (Then we should get...)
    expect(message).toEqual(messageMatcher(body))

    // checking directly in the database
    const messagesInDatabase = await selectMessages()
    expect(messagesInDatabase).toEqual([message])
  })
})

describe('findAll', () => {
  it('should return all messages', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    const user = await usersRepo.create(fakeUser())
    const sprint = await sprintsRepo.create(fakeSprint())
    const body = {userId: user!.id, sprintId: sprint!.id}

    await createMessages([
      fakeMessage({...body, messageStr: '🥳'}),
      fakeMessage({...body, messageStr: '🥳🥳'})
    ])

    // ACT (When we call...)
    const messages = await messagesRepo.findAll()

    // ASSERT (Then we should get...)
    expect(messages).toHaveLength(2)
    expect(messages[0]).toEqual(
      messageMatcher({
        ...body,
        messageStr: '🥳'
      })
    )
    expect(messages[1]).toEqual(
      messageMatcher({
        ...body,
        messageStr: '🥳🥳'
      })
    )
  })
})

describe('findById', () => {
  it('should return an message by id', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    const user = await usersRepo.create(fakeUser())
    const sprint = await sprintsRepo.create(fakeSprint())
    const body = {userId: user!.id, sprintId: sprint!.id}
    const [message] = await createMessages(fakeMessage({...body, id: 1371}))

    // ACT (When we call...)
    const foundMessage = await messagesRepo.findById(message!.id)

    // ASSERT (Then we should get...)
    expect(foundMessage).toEqual(messageMatcher(body))
  })

  it('should return undefined if message is not found', async () => {
    // ACT (When we call...)
    const foundMessage = await messagesRepo.findById(999999)

    // ASSERT (Then we should get...)
    expect(foundMessage).toBeUndefined()
  })
})

describe('update', () => {
  it('should update an message', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const user = await usersRepo.create(fakeUser())
    const sprint = await sprintsRepo.create(fakeSprint())
    const body = {userId: user!.id, sprintId: sprint!.id, messageStr: '🥳🥳🥳'}
    const [message] = await createMessages(fakeMessage(body))

    // ACT (When we call...)
    const updatedMessage = await messagesRepo.update(message.id, body)

    // ASSERT (Then we should get...)
    expect(updatedMessage).toMatchObject(messageMatcher(body))
  })

  it('should return the original message if no changes are made', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const user = await usersRepo.create(fakeUser())
    const sprint = await sprintsRepo.create(fakeSprint())
    const body = {userId: user!.id, sprintId: sprint!.id}
    const [message] = await createMessages(fakeMessage(body))

    // ACT (When we call...)
    if (!message) throw new Error('Message is missing.')
    const updatedMessage = await messagesRepo.update(message.id, {})

    // ASSERT (Then we should get...)
    expect(updatedMessage).toMatchObject(messageMatcher(body))
  })

  it('should return undefined if message is not found', async () => {
    // ACT (When we call...)
    const updatedMessage = await messagesRepo.update(999, {
      messageStr: '🥳🥳'
    })

    // We could also opt for throwing an error here, but this is a design decision

    // ASSERT (Then we should get...)
    expect(updatedMessage).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove an message', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const user = await usersRepo.create(fakeUser())
    const sprint = await sprintsRepo.create(fakeSprint())
    const body = {userId: user!.id, sprintId: sprint!.id}
    const [message] = await createMessages(fakeMessage(body))

    // ACT (When we call...)
    const removedMessage = await messagesRepo.remove(message.id)

    // ASSERT (Then we should get...)
    expect(removedMessage).toEqual(messageMatcher(body))
  })

  it('should return undefined if message is not found', async () => {
    // ACT (When we call...)
    const removedMessage = await messagesRepo.remove(999)

    // We could also opt for throwing an error here
    // but we decided to return undefined
    expect(removedMessage).toBeUndefined()
  })
})
