import {omit} from 'lodash/fp'
import {parse, parseInsertable, parseUpdateable} from '../schema'
import {fakeMessageFull} from './utils'

// Generally, schemas are tested with a few examples of valid and invalid records.

it('parses a valid record', () => {
  const record = fakeMessageFull()

  expect(parse(record)).toEqual(record)
})

it('throws an error due to empty/missing messageStr (concrete)', () => {
  // ARRANGE
  const body = {
    id: 1,
    userId: 2,
    sprintId: 3,
    createdOn: '2024-07-26T12:42:51.808Z'
  }

  const messageWithoutStr = {...body}
  const messageEmptyStr = {...body, messageStr: ''}

  // ACT & ASSERT
  // expect our function to throw an error that
  // mentions an issue with the title
  expect(() => parse(messageWithoutStr)).toThrow(/messageStr/i)
  expect(() => parse(messageEmptyStr)).toThrow(/messageStr/i)
})

it('throws an error due to empty/missing content', () => {
  const recordWithoutStr = omit(['messageStr'], fakeMessageFull())
  const recordEmpty = fakeMessageFull({
    messageStr: ''
  })

  expect(() => parse(recordWithoutStr)).toThrow(/messageStr/i)
  expect(() => parse(recordEmpty)).toThrow(/messageStr/i)
})

// every other function is a derivative of parse()
describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeMessageFull())

    expect(parsed).not.toHaveProperty('id')
  })
})

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdateable(fakeMessageFull())

    expect(parsed).not.toHaveProperty('id')
  })
})
