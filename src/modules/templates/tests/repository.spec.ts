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
  await db.deleteFrom('template').execute()
})

describe('create', () => {
  it('should create a template (explicitly listing all fields)', async () => {
    const template = await repository.create({
      templateStr: '{username} {title} {praise_str} {emoji_str}'
    })

    expect(template).toEqual({
      id: expect.any(Number),
      templateStr: '{username} {title} {praise_str} {emoji_str}'
    })

    const templatesInDatabase = await selectTemplates()
    expect(templatesInDatabase).toEqual([template])
  })

  it('should create an template (with fake data functions)', async () => {
    const template = await repository.create(fakeTemplate())

    expect(template).toEqual(templateMatcher())

    const templatesInDatabase = await selectTemplates()
    expect(templatesInDatabase).toEqual([template])
  })
})

describe('findAll', () => {
  it('should return all templates', async () => {
    await createTemplates([
      fakeTemplate({
        templateStr: 'Job well done!'
      }),
      fakeTemplate({
        templateStr: 'Job very well done!'
      })
    ])

    const templates = await repository.findAll()

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
    const [template] = await createTemplates(
      fakeTemplate({
        id: 1371
      })
    )

    const foundTemplate = await repository.findById(template!.id)

    expect(foundTemplate).toEqual(templateMatcher())
  })

  it('should return undefined if template is not found', async () => {
    const foundTemplate = await repository.findById(999999)

    expect(foundTemplate).toBeUndefined()
  })
})

describe('update', () => {
  it('should update an template', async () => {
    const [template] = await createTemplates(fakeTemplate())

    const updatedTemplate = await repository.update(template.id, {
      templateStr: '{username} {title} {praise_str} {emoji_str}'
    })

    expect(updatedTemplate).toMatchObject(
      templateMatcher({
        templateStr: '{username} {title} {praise_str} {emoji_str}'
      })
    )
  })

  it('should return the original template if no changes are made', async () => {
    const [template] = await createTemplates(fakeTemplate())

    const updatedTemplate = await repository.update(template.id, {})

    expect(updatedTemplate).toMatchObject(templateMatcher())
  })

  it('should return undefined if template is not found', async () => {
    const updatedTemplate = await repository.update(999, {
      templateStr: 'Updated template string!'
    })

    expect(updatedTemplate).toBeUndefined()
  })
})

describe('remove', () => {
  it('should remove an template', async () => {
    const [template] = await createTemplates(fakeTemplate())

    const removedTemplate = await repository.remove(template.id)

    expect(removedTemplate).toEqual(templateMatcher())
  })

  it('should return undefined if template is not found', async () => {
    const removedTemplate = await repository.remove(999)

    expect(removedTemplate).toBeUndefined()
  })
})
