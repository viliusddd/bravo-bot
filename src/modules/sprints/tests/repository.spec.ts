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
  await db.deleteFrom('sprint').execute()
})

describe('create', () => {
  it('should create an sprint (explicitly listing all fields)', async () => {
    const sprint = await repository.create({
      sprintTitle: 'First Steps Into Programming with Python',
      sprintCode: 'WD-1.1.5'
    })

    expect(sprint).toEqual({
      id: expect.any(Number),
      sprintTitle: 'First Steps Into Programming with Python',
      sprintCode: 'WD-1.1.5'
    })

    const sprintsInDatabase = await selectSprints()
    expect(sprintsInDatabase).toEqual([sprint])
  })

  it('should create an sprint (with fake data functions)', async () => {
    const sprint = await repository.create(fakeSprint())

    expect(sprint).toEqual(sprintMatcher())

    const sprintsInDatabase = await selectSprints()
    expect(sprintsInDatabase).toEqual([sprint])
  })
})

describe('findAll', () => {
  it('should return all sprints', async () => {
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

    const sprints = await repository.findAll()

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
    const [sprint] = await createSprints(
      fakeSprint({
        id: 1371
      })
    )

    const foundSprint = await repository.findById(sprint!.id)

    expect(foundSprint).toEqual(sprintMatcher())
  })

  it('should return undefined if sprint is not found', async () => {
    const foundSprint = await repository.findById(999999)

    expect(foundSprint).toBeUndefined()
  })
})

describe('update', () => {
  it('should update an sprint', async () => {
    const [sprint] = await createSprints(fakeSprint())

    const updatedSprint = await repository.update(sprint.id, {
      sprintTitle: 'Updated sprint'
    })

    expect(updatedSprint).toMatchObject(
      sprintMatcher({
        sprintTitle: 'Updated sprint'
      })
    )
  })

  it('should return the original sprint if no changes are made', async () => {
    const [sprint] = await createSprints(fakeSprint())

    const updatedSprint = await repository.update(sprint.id, {})

    expect(updatedSprint).toMatchObject(sprintMatcher())
  })

  it('should return undefined if sprint is not found', async () => {
    const updatedSprint = await repository.update(999, {
      sprintTitle: 'Updated sprint'
    })

    expect(updatedSprint).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove an sprint', async () => {
    const [sprint] = await createSprints(fakeSprint())

    const removedSprint = await repository.remove(sprint.id)

    expect(removedSprint).toEqual(sprintMatcher())
  })

  it('should return undefined if sprint is not found', async () => {
    const removedSprint = await repository.remove(999)

    expect(removedSprint).toBeUndefined()
  })
})
