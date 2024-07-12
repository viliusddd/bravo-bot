import {omit} from 'lodash/fp'
import {parse, parseInsertable, parseUpdateable} from '../schema'
import {fakeSprintFull} from './utils'

// Generally, schemas are tested with a few examples of valid and invalid records.

it('parses a valid record', () => {
  const record = fakeSprintFull()

  expect(parse(record)).toEqual(record)
})

it('throws an error due to empty/missing title (concrete)', () => {
  // ARRANGE
  const sprintWithoutTitle = {
    id: 52,
    code: 'WD-1.3.4'
  }
  const sprintEmptyTitle = {
    id: 52,
    title: '',
    code: 'WD-1.3.4'
  }

  // ACT & ASSERT
  // expect our function to throw an error that
  // mentions an issue with the title
  expect(() => parse(sprintWithoutTitle)).toThrow(/title/i)
  expect(() => parse(sprintEmptyTitle)).toThrow(/title/i)
})

// a more generic vesion of the above test, which makes
// no assumptions about other properties
it('throws an error due to empty/missing title (generic)', () => {
  const sprintWithoutTitle = omit(['title'], fakeSprintFull())
  const sprintEmptyTitle = fakeSprintFull({
    title: ''
  })

  expect(() => parse(sprintWithoutTitle)).toThrow(/title/i)
  expect(() => parse(sprintEmptyTitle)).toThrow(/title/i)
})

it('throws an error due to empty/missing code', () => {
  const recordWithoutContent = omit(['code'], fakeSprintFull())
  const recordEmpty = fakeSprintFull({
    code: ''
  })

  expect(() => parse(recordWithoutContent)).toThrow(/code/i)
  expect(() => parse(recordEmpty)).toThrow(/code/i)
})

// every other function is a derivative of parse()
describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeSprintFull())

    expect(parsed).not.toHaveProperty('id')
  })
})

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdateable(fakeSprintFull())

    expect(parsed).not.toHaveProperty('id')
  })
})
