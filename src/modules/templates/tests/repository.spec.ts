import createTestDatabase from '@tests/utils/createTestDatabase'
import {createFor, selectAllFor} from '@tests/utils/records'
import buildRepository from '../repository'
import {fakeTemplate, templateMatcher} from './utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createTemplates = createFor(db, 'template')
const selectTemplates = selectAllFor(db, 'template')

afterAll(() => db.destroy())

afterEach(async () => {
  // clearing the tested table after each test
  await db.deleteFrom('template').execute()
})

describe('create', () => {
  it('should create a template (explicitly listing all fields)', async () => {
    // ACT (When we call...)
    const template = await repository.create({
      templateStr: '{username} {title} {praise_str} {emoji_str}'
    })

    // ASSERT (Then we should get...)
    // checking the returned template
    expect(template).toEqual({
      // any number is fine, we might want to check that it is an integer
      // but this is good enough to drive our development
      id: expect.any(Number),
      templateStr: '{username} {title} {praise_str} {emoji_str}'
    })

    // checking directly in the database
    const templatesInDatabase = await selectTemplates()
    expect(templatesInDatabase).toEqual([template])
  })

  it('should create an template (with fake data functions)', async () => {
    // same as the test above, but using fake data functions
    // ACT (When we call...)
    const template = await repository.create(fakeTemplate())

    // ASSERT (Then we should get...)
    expect(template).toEqual(templateMatcher())

    // checking directly in the database
    const templatesInDatabase = await selectTemplates()
    expect(templatesInDatabase).toEqual([template])
  })
})

describe('findAll', () => {
  it('should return all templates', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    await createTemplates([
      fakeTemplate({
        templateStr: 'Job well done!'
      }),
      fakeTemplate({
        templateStr: 'Job very well done!'
      })
    ])

    // ACT (When we call...)
    const templates = await repository.findAll()

    // ASSERT (Then we should get...)
    expect(templates).toHaveLength(2)
    expect(templates[0]).toEqual(
      templateMatcher({templateStr: 'Job well done!'})
    )
    expect(templates[1]).toEqual(
      templateMatcher({templateStr: 'Job very well done!'})
    )
  })
})

describe('findById', () => {
  it('should return an template by id', async () => {
    // ARRANGE (Given that we have the following records in the database...)
    const [template] = await createTemplates(
      fakeTemplate({
        id: 1371
      })
    )

    // ACT (When we call...)
    const foundTemplate = await repository.findById(template!.id)

    // ASSERT (Then we should get...)
    expect(foundTemplate).toEqual(templateMatcher())
  })

  it('should return undefined if template is not found', async () => {
    // ACT (When we call...)
    const foundTemplate = await repository.findById(999999)

    // ASSERT (Then we should get...)
    expect(foundTemplate).toBeUndefined()
  })
})

describe('update', () => {
  it('should update an template', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [template] = await createTemplates(fakeTemplate())

    // ACT (When we call...)
    const updatedTemplate = await repository.update(template.id, {
      templateStr: '{username} {title} {praise_str} {emoji_str}'
    })

    // ASSERT (Then we should get...)
    expect(updatedTemplate).toMatchObject(
      templateMatcher({
        templateStr: '{username} {title} {praise_str} {emoji_str}'
      })
    )
  })

  it('should return the original template if no changes are made', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [template] = await createTemplates(fakeTemplate())

    // ACT (When we call...)
    const updatedTemplate = await repository.update(template.id, {})

    // ASSERT (Then we should get...)
    expect(updatedTemplate).toMatchObject(templateMatcher())
  })

  it('should return undefined if template is not found', async () => {
    // ACT (When we call...)
    const updatedTemplate = await repository.update(999, {
      templateStr: 'Updated template string!'
    })

    // We could also opt for throwing an error here, but this is a design decision

    // ASSERT (Then we should get...)
    expect(updatedTemplate).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove an template', async () => {
    // ARRANGE (Given that we have the following record in the database...)
    const [template] = await createTemplates(fakeTemplate())

    // ACT (When we call...)
    const removedTemplate = await repository.remove(template.id)

    // ASSERT (Then we should get...)
    expect(removedTemplate).toEqual(templateMatcher())
  })

  it('should return undefined if template is not found', async () => {
    // ACT (When we call...)
    const removedTemplate = await repository.remove(999)

    // We could also opt for throwing an error here
    // but we decided to return undefined
    expect(removedTemplate).toBeUndefined()
  })
})
