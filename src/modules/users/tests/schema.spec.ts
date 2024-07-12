import {omit} from 'lodash/fp'
import {parse, parseInsertable, parseUpdateable} from '../schema'
import {fakeUserFull} from './utils'

// Generally, schemas are tested with a few examples of valid and invalid records.

it('parses a valid record', () => {
  const record = fakeUserFull()

  expect(parse(record)).toEqual(record)
})

it('throws an error due to empty/missing username (concrete)', () => {
  // ARRANGE
  const userWithoutStr = {
    id: 52
  }
  const userEmptyStr = {
    id: 52,
    username: ''
  }

  // ACT & ASSERT
  // expect our function to throw an error that
  // mentions an issue with the title
  expect(() => parse(userWithoutStr)).toThrow(/username/i)
  expect(() => parse(userEmptyStr)).toThrow(/username/i)
})

it('throws an error due to empty/missing content', () => {
  const recordWithoutStr = omit(['username'], fakeUserFull())
  const recordEmpty = fakeUserFull({
    username: ''
  })

  expect(() => parse(recordWithoutStr)).toThrow(/username/i)
  expect(() => parse(recordEmpty)).toThrow(/username/i)
})

// every other function is a derivative of parse()
describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeUserFull())

    expect(parsed).not.toHaveProperty('id')
  })
})

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdateable(fakeUserFull())

    expect(parsed).not.toHaveProperty('id')
  })
})
