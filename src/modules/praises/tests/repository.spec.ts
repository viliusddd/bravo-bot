import createTestDatabase from '@tests/utils/createTestDatabase'
import {createFor, selectAllFor} from '@tests/utils/records'
import buildRepository from '../repository'
import {fakePraise, praiseMatcher} from './utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createPraises = createFor(db, 'praise')
const selectPraises = selectAllFor(db, 'praise')

afterAll(() => db.destroy())

afterEach(async () => {
  // clearing the tested table after each test
  await db.deleteFrom('praise').execute()
})

describe('create', () => {
  it('should create a praise (explicitly listing all fields)', async () => {
    // ACT (When we call...)
    const praise = await repository.create({
      praiseStr: 'Job well done!'
    })

    // ASSERT (Then we should get...)
    // checking the returned praise
    expect(praise).toEqual({
      // any number is fine, we might want to check that it is an integer
      // but this is good enough to drive our development
      id: expect.any(Number),
      praiseStr: 'Job well done!'
    })

    // checking directly in the database
    const praisesInDatabase = await selectPraises()
    expect(praisesInDatabase).toEqual([praise])
  })

  it('should create an praise (with fake data functions)', async () => {
    // same as the test above, but using fake data functions
    // ACT (When we call...)
    const praise = await repository.create(fakePraise())

    // ASSERT (Then we should get...)
    expect(praise).toEqual(praiseMatcher())

    // checking directly in the database
    const praisesInDatabase = await selectPraises()
    expect(praisesInDatabase).toEqual([praise])
  })
})

describe('findAll', () => {
  it('should return all praises', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    await createPraises([
      fakePraise({
        praiseStr: 'Job well done!'
      }),
      fakePraise({
        praiseStr: 'Job very well done!'
      })
    ])

    // ACT (When we call...)
    const praises = await repository.findAll()

    // ASSERT (Then we should get...)
    expect(praises).toHaveLength(2)
    expect(praises[0]).toEqual(praiseMatcher({praiseStr: 'Job well done!'}))
    expect(praises[1]).toEqual(
      praiseMatcher({praiseStr: 'Job very well done!'})
    )
  })
})

describe('findById', () => {
  it('should return an praise by id', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    const [praise] = await createPraises(
      fakePraise({
        id: 1371
      })
    )

    // ACT (When we call...)
    const foundPraise = await repository.findById(praise!.id)

    // ASSERT (Then we should get...)
    expect(foundPraise).toEqual(praiseMatcher())
  })

  it('should return undefined if praise is not found', async () => {
    // ACT (When we call...)
    const foundPraise = await repository.findById(999999)

    // ASSERT (Then we should get...)
    expect(foundPraise).toBeUndefined()
  })
})

describe('update', () => {
  it('should update an praise', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [praise] = await createPraises(fakePraise())

    // ACT (When we call...)
    const updatedPraise = await repository.update(praise.id, {
      praiseStr: 'Updated praise'
    })

    // ASSERT (Then we should get...)
    expect(updatedPraise).toMatchObject(
      praiseMatcher({
        praiseStr: 'Updated praise'
      })
    )
  })

  it('should return the original praise if no changes are made', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [praise] = await createPraises(fakePraise())

    // ACT (When we call...)
    const updatedPraise = await repository.update(praise.id, {})

    // ASSERT (Then we should get...)
    expect(updatedPraise).toMatchObject(praiseMatcher())
  })

  it('should return undefined if praise is not found', async () => {
    // ACT (When we call...)
    const updatedPraise = await repository.update(999, {
      praiseStr: 'Updated praise string!'
    })

    // We could also opt for throwing an error here, but this is a design decision

    // ASSERT (Then we should get...)
    expect(updatedPraise).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove an praise', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [praise] = await createPraises(fakePraise())

    // ACT (When we call...)
    const removedPraise = await repository.remove(praise.id)

    // ASSERT (Then we should get...)
    expect(removedPraise).toEqual(praiseMatcher())
  })

  it('should return undefined if praise is not found', async () => {
    // ACT (When we call...)
    const removedPraise = await repository.remove(999)

    // We could also opt for throwing an error here
    // but we decided to return undefined
    expect(removedPraise).toBeUndefined()
  })
})
