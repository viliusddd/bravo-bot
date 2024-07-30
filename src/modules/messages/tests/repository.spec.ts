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
  await db.deleteFrom('message').execute()
  await db.deleteFrom('sprint').execute()
  await db.deleteFrom('user').execute()
})

describe('create', () => {
  it('should create a message (explicitly listing all fields)', async () => {
    const user = await usersRepo.create({username: 'vjuodz'})
    const sprint = await sprintsRepo.create({
      sprintCode: 'WD-1.2.3',
      sprintTitle: '🏃🏻📕'
    })
    const body = {userId: user!.id, sprintId: sprint!.id}
    const message = await messagesRepo.create({...body, messageStr: '🥳'})

    expect(message).toEqual({
      id: expect.any(Number),
      ...body,
      messageStr: '🥳',
      createdOn: expect.any(String)
    })

    const messagesInDatabase = await selectMessages()
    expect(messagesInDatabase).toEqual([message])
  })

  it('should create an message (with fake data functions)', async () => {
    const user = await usersRepo.create(fakeUser())
    const sprint = await sprintsRepo.create(fakeSprint())
    const body = {userId: user!.id, sprintId: sprint!.id}
    const message = await messagesRepo.create(fakeMessage(body))

    expect(message).toEqual(messageMatcher(body))

    const messagesInDatabase = await selectMessages()
    expect(messagesInDatabase).toEqual([message])
  })
})

describe('findAll', () => {
  it('should return all messages', async () => {
    const user = await usersRepo.create(fakeUser())
    const sprint = await sprintsRepo.create(fakeSprint())
    const body = {userId: user!.id, sprintId: sprint!.id}

    await createMessages([
      fakeMessage({...body, messageStr: '🥳'}),
      fakeMessage({...body, messageStr: '🥳🥳'})
    ])

    const messages = await messagesRepo.findAll()

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
    const user = await usersRepo.create(fakeUser())
    const sprint = await sprintsRepo.create(fakeSprint())
    const body = {userId: user!.id, sprintId: sprint!.id}
    const [message] = await createMessages(fakeMessage({...body, id: 1371}))

    const foundMessage = await messagesRepo.findById(message!.id)

    expect(foundMessage).toEqual(messageMatcher(body))
  })

  it('should return undefined if message is not found', async () => {
    const foundMessage = await messagesRepo.findById(999999)

    expect(foundMessage).toBeUndefined()
  })
})

describe('update', () => {
  it('should update an message', async () => {
    const user = await usersRepo.create(fakeUser())
    const sprint = await sprintsRepo.create(fakeSprint())
    const body = {userId: user!.id, sprintId: sprint!.id, messageStr: '🥳🥳🥳'}
    const [message] = await createMessages(fakeMessage(body))

    const updatedMessage = await messagesRepo.update(message.id, body)

    expect(updatedMessage).toMatchObject(messageMatcher(body))
  })

  it('should return the original message if no changes are made', async () => {
    const user = await usersRepo.create(fakeUser())
    const sprint = await sprintsRepo.create(fakeSprint())
    const body = {userId: user!.id, sprintId: sprint!.id}
    const [message] = await createMessages(fakeMessage(body))

    if (!message) throw new Error('Message is missing.')
    const updatedMessage = await messagesRepo.update(message.id, {})

    expect(updatedMessage).toMatchObject(messageMatcher(body))
  })

  it('should return undefined if message is not found', async () => {
    const updatedMessage = await messagesRepo.update(999, {
      messageStr: '🥳🥳'
    })

    expect(updatedMessage).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove an message', async () => {
    const user = await usersRepo.create(fakeUser())
    const sprint = await sprintsRepo.create(fakeSprint())
    const body = {userId: user!.id, sprintId: sprint!.id}
    const [message] = await createMessages(fakeMessage(body))

    const removedMessage = await messagesRepo.remove(message.id)

    expect(removedMessage).toEqual(messageMatcher(body))
  })

  it('should return undefined if message is not found', async () => {
    const removedMessage = await messagesRepo.remove(999)

    expect(removedMessage).toBeUndefined()
  })
})
