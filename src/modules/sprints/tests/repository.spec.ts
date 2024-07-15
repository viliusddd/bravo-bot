import createTestDatabase from '@tests/utils/createTestDatabase'
import {createFor, selectAllFor} from '@tests/utils/records'
import buildRepository from '../repository'
import {fakeSprint, sprintMatcher} from './utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createSprints = createFor(db, 'sprint')
const selectSprints = selectAllFor(db, 'sprint')

afterAll(() => db.destroy())

afterEach(async () => {
  // clearing the tested table after each test
  await db.deleteFrom('sprint').execute()
})

describe('create', () => {
  it('should create an sprint (explicitly listing all fields)', async () => {
    // ACT (When we call...)
    const sprint = await repository.create({
      sprintTitle: 'First Steps Into Programming with Python',
      sprintCode: 'WD-1.1.5'
    })

    // ASSERT (Then we should get...)
    // checking the returned sprint
    expect(sprint).toEqual({
      // any number is fine, we might want to check that it is an integer
      // but this is good enough to drive our development
      id: expect.any(Number),
      sprintTitle: 'First Steps Into Programming with Python',
      sprintCode: 'WD-1.1.5'
    })

    // checking directly in the database
    const sprintsInDatabase = await selectSprints()
    expect(sprintsInDatabase).toEqual([sprint])
  })

  it('should create an sprint (with fake data functions)', async () => {
    // same as the test above, but using fake data functions
    // ACT (When we call...)
    const sprint = await repository.create(fakeSprint())

    // ASSERT (Then we should get...)
    expect(sprint).toEqual(sprintMatcher())

    // checking directly in the database
    const sprintsInDatabase = await selectSprints()
    expect(sprintsInDatabase).toEqual([sprint])
  })
})

describe('findAll', () => {
  it('should return all sprints', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    await createSprints([
      fakeSprint({
        sprintCode: 'WD-1.1.5',
        sprintTitle: 'First Steps Into Programming with Python'
      }),
      fakeSprint({
        sprintCode: 'WD-3.3.5',
        sprintTitle: 'Full-stack Fundamentals'
      })
    ])

    // ACT (When we call...)
    const sprints = await repository.findAll()

    // ASSERT (Then we should get...)
    expect(sprints).toHaveLength(2)
    expect(sprints[0]).toEqual(
      sprintMatcher({
        sprintCode: 'WD-1.1.5',
        sprintTitle: 'First Steps Into Programming with Python'
      })
    )
    expect(sprints[1]).toEqual(
      sprintMatcher({
        sprintCode: 'WD-3.3.5',
        sprintTitle: 'Full-stack Fundamentals'
      })
    )
  })
})

describe('findById', () => {
  it('should return an sprint by id', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    const [sprint] = await createSprints(
      fakeSprint({
        id: 1371
      })
    )

    // ACT (When we call...)
    const foundSprint = await repository.findById(sprint!.id)

    // ASSERT (Then we should get...)
    expect(foundSprint).toEqual(sprintMatcher())
  })

  it('should return undefined if sprint is not found', async () => {
    // ACT (When we call...)
    const foundSprint = await repository.findById(999999)

    // ASSERT (Then we should get...)
    expect(foundSprint).toBeUndefined()
  })
})

describe('update', () => {
  it('should update an sprint', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [sprint] = await createSprints(fakeSprint())

    // ACT (When we call...)
    const updatedSprint = await repository.update(sprint.id, {
      sprintTitle: 'Updated sprint'
    })

    // ASSERT (Then we should get...)
    expect(updatedSprint).toMatchObject(
      sprintMatcher({
        sprintTitle: 'Updated sprint'
      })
    )
  })

  it('should return the original sprint if no changes are made', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [sprint] = await createSprints(fakeSprint())

    // ACT (When we call...)
    const updatedSprint = await repository.update(sprint.id, {})

    // ASSERT (Then we should get...)
    expect(updatedSprint).toMatchObject(sprintMatcher())
  })

  it('should return undefined if sprint is not found', async () => {
    // ACT (When we call...)
    const updatedSprint = await repository.update(999, {
      sprintTitle: 'Updated sprint'
    })

    // We could also opt for throwing an error here, but this is a design decision

    // ASSERT (Then we should get...)
    expect(updatedSprint).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove an sprint', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [sprint] = await createSprints(fakeSprint())

    // ACT (When we call...)
    const removedSprint = await repository.remove(sprint.id)

    // ASSERT (Then we should get...)
    expect(removedSprint).toEqual(sprintMatcher())
  })

  it('should return undefined if sprint is not found', async () => {
    // ACT (When we call...)
    const removedSprint = await repository.remove(999)

    // We could also opt for throwing an error here
    // but we decided to return undefined
    expect(removedSprint).toBeUndefined()
  })
})
