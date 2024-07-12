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
  // clearing the tested table after each test
  await db.deleteFrom('user').execute()
})

describe('create', () => {
  it('should create a user (explicitly listing all fields)', async () => {
    // ACT (When we call...)
    const user = await repository.create({
      username: 'vjuodz'
    })

    // ASSERT (Then we should get...)
    // checking the returned user
    expect(user).toEqual({
      // any number is fine, we might want to check that it is an integer
      // but this is good enough to drive our development
      id: expect.any(Number),
      username: 'vjuodz'
    })

    // checking directly in the database
    const usersInDatabase = await selectUsers()
    expect(usersInDatabase).toEqual([user])
  })

  it('should create an user (with fake data functions)', async () => {
    // same as the test above, but using fake data functions
    // ACT (When we call...)
    const user = await repository.create(fakeUser())

    // ASSERT (Then we should get...)
    expect(user).toEqual(userMatcher())

    // checking directly in the database
    const usersInDatabase = await selectUsers()
    expect(usersInDatabase).toEqual([user])
  })
})

describe('findAll', () => {
  it('should return all users', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    await createUsers([
      fakeUser({
        username: 'vjuodz'
      }),
      fakeUser({
        username: 'ddidzi'
      })
    ])

    // ACT (When we call...)
    const users = await repository.findAll()

    // ASSERT (Then we should get...)
    expect(users).toHaveLength(2)
    expect(users[0]).toEqual(userMatcher({username: 'vjuodz'}))
    expect(users[1]).toEqual(userMatcher({username: 'ddidzi'}))
  })
})

describe('findById', () => {
  it('should return an user by id', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    const [user] = await createUsers(
      fakeUser({
        id: 1371
      })
    )

    // ACT (When we call...)
    const foundUser = await repository.findById(user!.id)

    // ASSERT (Then we should get...)
    expect(foundUser).toEqual(userMatcher())
  })

  it('should return undefined if user is not found', async () => {
    // ACT (When we call...)
    const foundUser = await repository.findById(999999)

    // ASSERT (Then we should get...)
    expect(foundUser).toBeUndefined()
  })
})

describe('update', () => {
  it('should update an user', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [user] = await createUsers(fakeUser())

    // ACT (When we call...)
    const updatedUser = await repository.update(user.id, {
      username: 'jiylee'
    })

    // ASSERT (Then we should get...)
    expect(updatedUser).toMatchObject(
      userMatcher({
        username: 'jiylee'
      })
    )
  })

  it('should return the original user if no changes are made', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [user] = await createUsers(fakeUser())

    // ACT (When we call...)
    const updatedUser = await repository.update(user.id, {})

    // ASSERT (Then we should get...)
    expect(updatedUser).toMatchObject(userMatcher())
  })

  it('should return undefined if user is not found', async () => {
    // ACT (When we call...)
    const updatedUser = await repository.update(999, {
      username: 'vjuodz'
    })

    // We could also opt for throwing an error here, but this is a design decision

    // ASSERT (Then we should get...)
    expect(updatedUser).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove an user', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [user] = await createUsers(fakeUser())

    // ACT (When we call...)
    const removedUser = await repository.remove(user.id)

    // ASSERT (Then we should get...)
    expect(removedUser).toEqual(userMatcher())
  })

  it('should return undefined if user is not found', async () => {
    // ACT (When we call...)
    const removedUser = await repository.remove(999)

    // We could also opt for throwing an error here
    // but we decided to return undefined
    expect(removedUser).toBeUndefined()
  })
})
