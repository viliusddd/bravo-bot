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
  await db.deleteFrom('praise').execute()
})

describe('create', () => {
  it('should create a praise (explicitly listing all fields)', async () => {
    const praise = await repository.create({
      praiseStr: 'Job well done!'
    })

    expect(praise).toEqual({
      id: expect.any(Number),
      praiseStr: 'Job well done!'
    })

    const praisesInDatabase = await selectPraises()
    expect(praisesInDatabase).toEqual([praise])
  })

  it('should create an praise (with fake data functions)', async () => {
    const praise = await repository.create(fakePraise())

    expect(praise).toEqual(praiseMatcher())

    const praisesInDatabase = await selectPraises()
    expect(praisesInDatabase).toEqual([praise])
  })
})

describe('findAll', () => {
  it('should return all praises', async () => {
    await createPraises([
      fakePraise({
        praiseStr: 'Job well done!'
      }),
      fakePraise({
        praiseStr: 'Job very well done!'
      })
    ])

    const praises = await repository.findAll()

    expect(praises).toHaveLength(2)
    expect(praises[0]).toEqual(praiseMatcher({praiseStr: 'Job well done!'}))
    expect(praises[1]).toEqual(
      praiseMatcher({praiseStr: 'Job very well done!'})
    )
  })
})

describe('findById', () => {
  it('should return an praise by id', async () => {
    const [praise] = await createPraises(
      fakePraise({
        id: 1371
      })
    )

    const foundPraise = await repository.findById(praise!.id)

    expect(foundPraise).toEqual(praiseMatcher())
  })

  it('should return undefined if praise is not found', async () => {
    const foundPraise = await repository.findById(999999)

    expect(foundPraise).toBeUndefined()
  })
})

describe('update', () => {
  it('should update an praise', async () => {
    const [praise] = await createPraises(fakePraise())

    const updatedPraise = await repository.update(praise.id, {
      praiseStr: 'Updated praise'
    })

    expect(updatedPraise).toMatchObject(
      praiseMatcher({
        praiseStr: 'Updated praise'
      })
    )
  })

  it('should return the original praise if no changes are made', async () => {
    const [praise] = await createPraises(fakePraise())

    const updatedPraise = await repository.update(praise.id, {})

    expect(updatedPraise).toMatchObject(praiseMatcher())
  })

  it('should return undefined if praise is not found', async () => {
    const updatedPraise = await repository.update(999, {
      praiseStr: 'Updated praise string!'
    })

    expect(updatedPraise).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove an praise', async () => {
    const [praise] = await createPraises(fakePraise())

    const removedPraise = await repository.remove(praise.id)

    expect(removedPraise).toEqual(praiseMatcher())
  })

  it('should return undefined if praise is not found', async () => {
    const removedPraise = await repository.remove(999)

    expect(removedPraise).toBeUndefined()
  })
})
