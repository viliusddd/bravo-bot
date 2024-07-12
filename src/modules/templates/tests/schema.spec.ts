import {omit} from 'lodash/fp'
import {parse, parseInsertable, parseUpdateable} from '../schema'
import {fakeTemplateFull} from './utils'

// Generally, schemas are tested with a few examples of valid and invalid records.

it('parses a valid record', () => {
  const record = fakeTemplateFull()

  expect(parse(record)).toEqual(record)
})

it('throws an error due to empty/missing templateStr (concrete)', () => {
  // ARRANGE
  const templateWithoutStr = {
    id: 52
  }
  const templateEmptyStr = {
    id: 52,
    templateStr: ''
  }

  // ACT & ASSERT
  // expect our function to throw an error that
  // mentions an issue with the title
  expect(() => parse(templateWithoutStr)).toThrow(/templateStr/i)
  expect(() => parse(templateEmptyStr)).toThrow(/templateStr/i)
})

it('throws an error due to empty/missing content', () => {
  const recordWithoutStr = omit(['templateStr'], fakeTemplateFull())
  const recordEmpty = fakeTemplateFull({
    templateStr: ''
  })

  expect(() => parse(recordWithoutStr)).toThrow(/templateStr/i)
  expect(() => parse(recordEmpty)).toThrow(/templateStr/i)
})

// every other function is a derivative of parse()
describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeTemplateFull())

    expect(parsed).not.toHaveProperty('id')
  })
})

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdateable(fakeTemplateFull())

    expect(parsed).not.toHaveProperty('id')
  })
})
