import createTestDatabase from '@tests/utils/createTestDatabase'
import {createFor, selectAllFor} from '@tests/utils/records'
import buildRepository from '../repository'
import {fakeUser, userMatcher} from './utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createUsers = createFor(db, 'user')
const selectUsers = selectAllFor(db, 'user')

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('user').execute()
})

describe('create', () => {
  it('should create a user (explicitly listing all fields)', async () => {
    const user = await repository.create({
      username: 'vjuodz'
    })

    expect(user).toEqual({
      id: expect.any(Number),
      username: 'vjuodz'
    })

    const usersInDatabase = await selectUsers()
    expect(usersInDatabase).toEqual([user])
  })

  it('should create an user (with fake data functions)', async () => {
    const user = await repository.create(fakeUser())

    expect(user).toEqual(userMatcher())

    const usersInDatabase = await selectUsers()
    expect(usersInDatabase).toEqual([user])
  })
})

describe('findAll', () => {
  it('should return all users', async () => {
    await createUsers([
      fakeUser({
        username: 'vjuodz'
      }),
      fakeUser({
        username: 'ddidzi'
      })
    ])

    const users = await repository.findAll()

    expect(users).toHaveLength(2)
    expect(users[0]).toEqual(userMatcher({username: 'vjuodz'}))
    expect(users[1]).toEqual(userMatcher({username: 'ddidzi'}))
  })
})

describe('findById', () => {
  it('should return an user by id', async () => {
    const [user] = await createUsers(
      fakeUser({
        id: 1371
      })
    )

    const foundUser = await repository.findById(user!.id)

    expect(foundUser).toEqual(userMatcher())
  })

  it('should return undefined if user is not found', async () => {
    const foundUser = await repository.findById(999999)

    expect(foundUser).toBeUndefined()
  })
})

describe('update', () => {
  it('should update an user', async () => {
    const [user] = await createUsers(fakeUser())

    const updatedUser = await repository.update(user.id, {
      username: 'jiylee'
    })

    expect(updatedUser).toMatchObject(
      userMatcher({
        username: 'jiylee'
      })
    )
  })

  it('should return the original user if no changes are made', async () => {
    const [user] = await createUsers(fakeUser())

    const updatedUser = await repository.update(user.id, {})

    expect(updatedUser).toMatchObject(userMatcher())
  })

  it('should return undefined if user is not found', async () => {
    const updatedUser = await repository.update(999, {
      username: 'vjuodz'
    })

    expect(updatedUser).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove an user', async () => {
    const [user] = await createUsers(fakeUser())

    const removedUser = await repository.remove(user.id)

    expect(removedUser).toEqual(userMatcher())
  })

  it('should return undefined if user is not found', async () => {
    const removedUser = await repository.remove(999)

    expect(removedUser).toBeUndefined()
  })
})
