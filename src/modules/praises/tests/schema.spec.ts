import {omit} from 'lodash/fp'
import {parse, parseInsertable, parseUpdateable} from '../schema'
import {fakePraiseFull} from './utils'

// Generally, schemas are tested with a few examples of valid and invalid records.

it('parses a valid record', () => {
  const record = fakePraiseFull()

  expect(parse(record)).toEqual(record)
})

it('throws an error due to empty/missing title (concrete)', () => {
  // ARRANGE
  const articleWithoutTitle = {
    id: 52,
    title: '',
    content: 'content'
  }
  const articleEmptyTitle = {
    id: 52,
    title: '',
    content: 'content'
  }

  // ACT & ASSERT
  // expect our function to throw an error that
  // mentions an issue with the title
  expect(() => parse(articleWithoutTitle)).toThrow(/praiseStr/i)
  expect(() => parse(articleEmptyTitle)).toThrow(/praiseStr/i)
})

it('throws an error due to empty/missing content', () => {
  const recordWithoutContent = omit(['praiseStr'], fakePraiseFull())
  const recordEmpty = fakePraiseFull({
    praiseStr: ''
  })

  expect(() => parse(recordWithoutContent)).toThrow(/praiseStr/i)
  expect(() => parse(recordEmpty)).toThrow(/praiseStr/i)
})

// every other function is a derivative of parse()
describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakePraiseFull())

    expect(parsed).not.toHaveProperty('id')
  })
})

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdateable(fakePraiseFull())

    expect(parsed).not.toHaveProperty('id')
  })
})
